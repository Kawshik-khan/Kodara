"""Record a real line-by-line trace of a chapter file with sys.settrace.

Usage (from courses/harness-playbook):
    python -m tools.record_trace harness.ch02.trace_scenarios ../../src/content/courses/harness-playbook/ch02/aciRefund.trace.json

The scenarios module defines SOURCE (path of the traced file, relative to
this course folder) and SCENARIOS (name -> setup function returning
(run, watched_objects)). Every step is an actual CPython 'line',
'exception' or value-returning 'return' event inside SOURCE, with the call
stack, frame locals and the watched objects' attributes.
"""
import dataclasses
import enum
import importlib
import json
import os
import sys

MAX_REPR = 60


def _repr(value):
    """Deterministic repr: no memory addresses, sets sorted."""
    if isinstance(value, enum.Enum):
        return f"{type(value).__name__}.{value.name}"
    if callable(value) and hasattr(value, "__qualname__") and not isinstance(value, type):
        return f"<function {value.__qualname__}>"
    if dataclasses.is_dataclass(value) and not isinstance(value, type):
        first = dataclasses.fields(value)[0].name
        return f"{type(value).__name__}({first}={_repr(getattr(value, first))})"
    if isinstance(value, BaseException):
        return f"{type(value).__name__}({str(value)!r})"
    if isinstance(value, (set, frozenset)):
        inner = ", ".join(sorted(_repr(v) for v in value))
        return f"{{{inner}}}" if isinstance(value, set) else f"frozenset({{{inner}}})"
    if isinstance(value, dict):
        return "{" + ", ".join(f"{_repr(k)}: {_repr(v)}" for k, v in value.items()) + "}"
    if isinstance(value, (list, tuple)):
        inner = ", ".join(_repr(v) for v in value)
        return f"[{inner}]" if isinstance(value, list) else f"({inner}{',' if len(value) == 1 else ''})"
    if type(value).__module__ != "builtins" and hasattr(value, "__dict__"):
        return f"{type(value).__name__}()"
    return repr(value)


def short(value):
    """Readable, bounded representation of a value for the trace."""
    text = _repr(value)
    return text if len(text) <= MAX_REPR else text[: MAX_REPR - 3] + "..."


def plain(value):
    """True for JSON-able data made of dicts with string keys, lists and scalars."""
    if isinstance(value, (str, int, float, bool, type(None))):
        return True
    if isinstance(value, list):
        return all(plain(v) for v in value)
    if isinstance(value, dict):
        return all(isinstance(k, str) and plain(v) for k, v in value.items())
    return False


def as_data(value):
    """Dataclass instances (also inside lists and dicts) become dicts."""
    if dataclasses.is_dataclass(value) and not isinstance(value, type):
        return {f.name: as_data(getattr(value, f.name)) for f in dataclasses.fields(value)}
    if isinstance(value, list):
        return [as_data(v) for v in value]
    if isinstance(value, dict):
        return {k: as_data(v) for k, v in value.items()}
    return value


def snapshot_object(obj):
    """Attributes of a watched object; plain data is kept as JSON values.
    A watched list or dict (no attributes) is shown as a single "items" entry."""
    attrs = vars(obj) if hasattr(obj, "__dict__") else {"items": obj}
    out = {}
    for key, value in attrs.items():
        data = as_data(value)
        out[key] = json.loads(json.dumps(data)) if plain(data) else short(value)
    return out


def record(run, watched, source_path):
    target = os.path.normcase(os.path.abspath(source_path))
    in_source = lambda frame: os.path.normcase(os.path.abspath(frame.f_code.co_filename)) == target
    steps = []

    def snap(frame, event, arg):
        stack, f = [], frame
        while f is not None:
            if in_source(f):
                stack.append(f)
            f = f.f_back
        stack.reverse()
        step = {
            "line": frame.f_lineno,
            "event": event,
            "frames": [{
                "fn": fr.f_code.co_qualname,
                "line": fr.f_lineno,
                "locals": {k: short(v) for k, v in fr.f_locals.items() if k not in ("self", "__class__")},
            } for fr in stack],
            "objects": {name: snapshot_object(obj) for name, obj in watched.items()},
        }
        if event == "exception":
            step["detail"] = short(arg[1])
        elif event == "return":
            step["detail"] = short(arg)
        steps.append(step)

    def local(frame, event, arg):
        if event in ("line", "exception") or (event == "return" and arg is not None):
            snap(frame, event, arg)
        return local

    sys.settrace(lambda frame, event, arg: local if in_source(frame) else None)
    try:
        run()
    finally:
        sys.settrace(None)
    return steps


def main(module_name, out_path):
    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sys.path.insert(0, here)
    module = importlib.import_module(module_name)
    source_path = os.path.join(here, module.SOURCE)
    with open(source_path, encoding="utf-8") as f:
        source = f.read().rstrip("\n")

    scenarios = {}
    for name, setup in module.SCENARIOS.items():
        run, watched = setup()
        scenarios[name] = record(run, watched, source_path)

    data = {"source": source, "sourcePath": module.SOURCE, "python": sys.version.split()[0], "scenarios": scenarios}
    with open(out_path, "w", encoding="utf-8", newline="\n") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
        f.write("\n")
    for name, steps in scenarios.items():
        print(f"{name}: {len(steps)} steps")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])

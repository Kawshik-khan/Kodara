/** Kodara Progress Subsystem - Recommendation Engine */
import { MasterySnapshot } from '../types/mastery.types';
import { ReviewQueue } from '../types/review.types';
import { NextBestAction, ActionType } from '../types/recommendation.types';

export interface CurriculumContext {
    currentLessonId?: string;
    currentLessonTitleEn?: string;
    currentLessonTitleBn?: string;
    nextLessonId?: string;
    nextLessonTitleEn?: string;
    nextLessonTitleBn?: string;
    nextLessonSlug?: string;
    availableChallengeIds: string[];
    completedLessonIds: string[];
    weakConceptIds: string[];
}

export function generateRecommendations(
    snapshot: MasterySnapshot,
    reviewQueue: ReviewQueue,
    curriculum: CurriculumContext,
    _maxResults: number = 3
): NextBestAction {
    const criticalReviewItems = reviewQueue.items.filter(i => i.priority === 'critical');
    const totalReviewItems = reviewQueue.items.length;
    
    let type: ActionType = 'start_project';
    let relevanceScore = 0.5;
    let reasonEn = 'Continue your learning journey.';
    let reasonBn = 'আপনার শেখার যাত্রা চালিয়ে যান।';
    let targetId = '';
    
    if (criticalReviewItems.length > 0) {
        type = 'review_decayed';
        relevanceScore = Math.min(1.0, 0.95 + (0.05 * (criticalReviewItems.length / Math.max(1, totalReviewItems))));
        reasonEn = 'Critical concepts need immediate review.';
        reasonBn = 'গুরুত্বপূর্ণ ধারণাগুলো অবিলম্বে পর্যালোচনা করা প্রয়োজন।';
        targetId = criticalReviewItems[0].conceptId;
    } else if (curriculum.currentLessonId) {
        type = 'continue_lesson';
        relevanceScore = 0.85;
        reasonEn = `Continue lesson: ${curriculum.currentLessonTitleEn || ''}`;
        reasonBn = `পাঠ চালিয়ে যান: ${curriculum.currentLessonTitleBn || ''}`;
        targetId = curriculum.currentLessonId;
    } else if (curriculum.nextLessonId) {
        type = 'start_lesson';
        relevanceScore = 0.75;
        reasonEn = `Start next lesson: ${curriculum.nextLessonTitleEn || ''}`;
        reasonBn = `পরবর্তী পাঠ শুরু করুন: ${curriculum.nextLessonTitleBn || ''}`;
        targetId = curriculum.nextLessonId;
    } else if (curriculum.weakConceptIds && curriculum.weakConceptIds.length > 0) {
        type = 'practice_weak_concepts';
        let avgWeakScore = 0;
        let count = 0;
        for (const cid of curriculum.weakConceptIds) {
            const concept = snapshot.concepts.get(cid);
            if (concept) {
                avgWeakScore += concept.score;
                count++;
            }
        }
        if (count > 0) avgWeakScore /= count;
        
        relevanceScore = Math.max(0.0, 0.70 - (0.1 * avgWeakScore));
        reasonEn = 'Practice weak concepts to improve mastery.';
        reasonBn = 'দক্ষতা বাড়াতে দুর্বল ধারণাগুলো অনুশীলন করুন।';
        targetId = curriculum.weakConceptIds[0];
    } else if (curriculum.availableChallengeIds && curriculum.availableChallengeIds.length > 0) {
        type = 'take_challenge';
        relevanceScore = 0.65;
        reasonEn = 'Take a challenge to test your skills.';
        reasonBn = 'আপনার দক্ষতা যাচাই করতে একটি চ্যালেঞ্জ গ্রহণ করুন।';
        targetId = curriculum.availableChallengeIds[0];
    } else {
        type = 'start_project';
        relevanceScore = 0.50;
        reasonEn = 'Start a new project to apply what you learned.';
        reasonBn = 'আপনি যা শিখেছেন তা প্রয়োগ করতে একটি নতুন প্রকল্প শুরু করুন।';
        targetId = 'project_board';
    }
    
    return {
        type,
        targetId,
        relevanceScore,
        reasonEn,
        reasonBn,
        metadata: {
            curriculumContext: curriculum
        }
    } as unknown as NextBestAction;
}

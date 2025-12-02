// Data Storage Module for localStorage operations
class DataStorage {
    constructor() {
        this.STORAGE_KEYS = {
            PREFERENCES: 'dsa_visual_lab_preferences',
            PROGRESS: 'dsa_visual_lab_progress',
            QUIZ_SCORES: 'dsa_visual_lab_quiz_scores',
            SAVED_EXAMPLES: 'dsa_visual_lab_saved_examples',
            CODE_SNIPPETS: 'dsa_visual_lab_code_snippets'
        };
    }

    // Preferences management
    getPreference(key) {
        const preferences = this.getAllPreferences();
        return preferences[key];
    }

    setPreference(key, value) {
        const preferences = this.getAllPreferences();
        preferences[key] = value;
        localStorage.setItem(this.STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
    }

    getAllPreferences() {
        const data = localStorage.getItem(this.STORAGE_KEYS.PREFERENCES);
        return data ? JSON.parse(data) : {};
    }

    // Progress tracking
    getProgress() {
        const data = localStorage.getItem(this.STORAGE_KEYS.PROGRESS);
        return data ? JSON.parse(data) : {
            completedTopics: [],
            recentActivity: null,
            totalTimeSpent: 0,
            achievements: []
        };
    }

    updateProgress(topic, action, details = {}) {
        const progress = this.getProgress();
        
        // Add topic to completed if not already there
        if (!progress.completedTopics.includes(topic)) {
            progress.completedTopics.push(topic);
        }
        
        // Update recent activity
        progress.recentActivity = {
            topic,
            action,
            timestamp: new Date().toISOString(),
            details
        };
        
        // Update total time (in minutes)
        if (details.timeSpent) {
            progress.totalTimeSpent += details.timeSpent;
        }
        
        localStorage.setItem(this.STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
        return progress;
    }

    // Quiz scores
    getQuizScores() {
        const data = localStorage.getItem(this.STORAGE_KEYS.QUIZ_SCORES);
        return data ? JSON.parse(data) : {};
    }

    saveQuizScore(topic, score, totalQuestions) {
        const scores = this.getQuizScores();
        scores[topic] = {
            score,
            totalQuestions,
            percentage: Math.round((score / totalQuestions) * 100),
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(this.STORAGE_KEYS.QUIZ_SCORES, JSON.stringify(scores));
        return scores[topic];
    }

    // Saved examples
    getSavedExamples() {
        const data = localStorage.getItem(this.STORAGE_KEYS.SAVED_EXAMPLES);
        return data ? JSON.parse(data) : [];
    }

    saveExample(example) {
        const examples = this.getSavedExamples();
        examples.push({
            ...example,
            id: Date.now().toString(),
            timestamp: new Date().toISOString()
        });
        localStorage.setItem(this.STORAGE_KEYS.SAVED_EXAMPLES, JSON.stringify(examples));
        return examples;
    }

    deleteExample(exampleId) {
        const examples = this.getSavedExamples();
        const filtered = examples.filter(exp => exp.id !== exampleId);
        localStorage.setItem(this.STORAGE_KEYS.SAVED_EXAMPLES, JSON.stringify(filtered));
        return filtered;
    }

    // Code snippets
    getCodeSnippets() {
        const data = localStorage.getItem(this.STORAGE_KEYS.CODE_SNIPPETS);
        return data ? JSON.parse(data) : [];
    }

    saveCodeSnippet(snippet) {
        const snippets = this.getCodeSnippets();
        snippets.push({
            ...snippet,
            id: Date.now().toString(),
            timestamp: new Date().toISOString()
        });
        localStorage.setItem(this.STORAGE_KEYS.CODE_SNIPPETS, JSON.stringify(snippets));
        return snippets;
    }

    deleteCodeSnippet(snippetId) {
        const snippets = this.getCodeSnippets();
        const filtered = snippets.filter(snip => snip.id !== snippetId);
        localStorage.setItem(this.STORAGE_KEYS.CODE_SNIPPETS, JSON.stringify(filtered));
        return filtered;
    }

    // Clear all data
    clearAllData() {
        Object.values(this.STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }

    // Export data
    exportData() {
        const data = {};
        Object.values(this.STORAGE_KEYS).forEach(key => {
            data[key] = localStorage.getItem(key);
        });
        return JSON.stringify(data, null, 2);
    }

    // Import data
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            Object.entries(data).forEach(([key, value]) => {
                if (Object.values(this.STORAGE_KEYS).includes(key)) {
                    localStorage.setItem(key, value);
                }
            });
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
}

export { DataStorage };
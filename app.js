// Main Application JavaScript
import { DataStorage } from './modules/data-storage.js';
import { Algorithms } from './modules/algorithms.js';

class DSAVisualLab {
    constructor() {
        this.storage = new DataStorage();
        this.algorithms = new Algorithms();
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('visualizer')) return 'visualizer';
        if (path.includes('topics')) return 'topics';
        if (path.includes('code-editor')) return 'code-editor';
        if (path.includes('quiz')) return 'quiz';
        if (path.includes('progress')) return 'progress';
        return 'home';
    }

    init() {
        this.setupTheme();
        this.setupEventListeners();
        this.loadPageContent();
        this.updateProgress();
    }

    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const currentTheme = this.storage.getPreference('theme') || 'light';
        
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        themeToggle.innerHTML = currentTheme === 'dark' 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            themeToggle.innerHTML = newTheme === 'dark' 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
            
            this.storage.setPreference('theme', newTheme);
        });
    }

    setupEventListeners() {
        // Login button
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                this.showLoginModal();
            });
        }

        // Topic search
        const topicSearch = document.getElementById('topicSearch');
        if (topicSearch) {
            topicSearch.addEventListener('input', (e) => {
                this.filterTopics(e.target.value);
            });
        }
    }

    async loadPageContent() {
        switch (this.currentPage) {
            case 'home':
                await this.loadHomePage();
                break;
            case 'topics':
                await this.loadTopicsPage();
                break;
            case 'visualizer':
                await this.loadVisualizerPage();
                break;
            case 'code-editor':
                await this.loadCodeEditorPage();
                break;
            case 'quiz':
                await this.loadQuizPage();
                break;
            case 'progress':
                await this.loadProgressPage();
                break;
        }
    }

    async loadHomePage() {
        await this.loadTopicsGrid();
        this.updateProgress();
    }

    async loadTopicsGrid() {
        const topicsGrid = document.getElementById('topicsGrid');
        if (!topicsGrid) return;

        const topics = await this.getTopics();
        topicsGrid.innerHTML = '';

        topics.forEach(topic => {
            const topicCard = this.createTopicCard(topic);
            topicsGrid.appendChild(topicCard);
        });
    }

    async getTopics() {
        return [
            {
                id: 'arrays',
                title: 'Arrays',
                description: 'Learn about array operations, searching, and sorting algorithms with interactive visualizations.',
                icon: 'fas fa-list-ol',
                difficulty: 'beginner',
                time: '30 min',
                color: '#3b82f6'
            },
            {
                id: 'linked-lists',
                title: 'Linked Lists',
                description: 'Visualize singly, doubly, and circular linked lists with operations like insert, delete, and reverse.',
                icon: 'fas fa-link',
                difficulty: 'intermediate',
                time: '45 min',
                color: '#8b5cf6'
            },
            {
                id: 'stacks-queues',
                title: 'Stacks & Queues',
                description: 'Understand LIFO and FIFO principles with animated stack and queue operations.',
                icon: 'fas fa-layer-group',
                difficulty: 'beginner',
                time: '25 min',
                color: '#10b981'
            },
            {
                id: 'trees',
                title: 'Trees',
                description: 'Explore binary trees, BST, AVL trees, and tree traversal algorithms.',
                icon: 'fas fa-project-diagram',
                difficulty: 'intermediate',
                time: '60 min',
                color: '#f59e0b'
            },
            {
                id: 'heaps',
                title: 'Heaps',
                description: 'Visualize min-heap and max-heap structures with heapify operations.',
                icon: 'fas fa-sitemap',
                difficulty: 'intermediate',
                time: '40 min',
                color: '#ef4444'
            },
            {
                id: 'graphs',
                title: 'Graphs',
                description: 'Learn graph algorithms like BFS, DFS, Dijkstra with interactive node manipulation.',
                icon: 'fas fa-network-wired',
                difficulty: 'advanced',
                time: '75 min',
                color: '#ec4899'
            },
            {
                id: 'hashing',
                title: 'Hash Tables',
                description: 'Understand hash functions, collisions, and different resolution techniques.',
                icon: 'fas fa-key',
                difficulty: 'intermediate',
                time: '35 min',
                color: '#06b6d4'
            },
            {
                id: 'sorting',
                title: 'Sorting Algorithms',
                description: 'Compare and visualize various sorting algorithms with step-by-step execution.',
                icon: 'fas fa-sort-amount-down',
                difficulty: 'beginner',
                time: '50 min',
                color: '#84cc16'
            },
            {
                id: 'searching',
                title: 'Searching Algorithms',
                description: 'Visualize linear search, binary search, and other search techniques.',
                icon: 'fas fa-search',
                difficulty: 'beginner',
                time: '20 min',
                color: '#f97316'
            }
        ];
    }

    createTopicCard(topic) {
        const card = document.createElement('div');
        card.className = 'topic-card';
        card.dataset.topicId = topic.id;
        
        card.innerHTML = `
            <div class="topic-icon" style="color: ${topic.color}">
                <i class="${topic.icon}"></i>
            </div>
            <h3 class="topic-title">${topic.title}</h3>
            <p class="topic-desc">${topic.description}</p>
            <div class="topic-meta">
                <span class="topic-difficulty difficulty-${topic.difficulty}">
                    ${topic.difficulty.charAt(0).toUpperCase() + topic.difficulty.slice(1)}
                </span>
                <span class="topic-time">
                    <i class="far fa-clock"></i> ${topic.time}
                </span>
            </div>
            <button class="btn btn-primary" onclick="window.location.href='pages/visualizer.html?topic=${topic.id}'">
                <i class="fas fa-play"></i> Visualize
            </button>
        `;
        
        return card;
    }

    filterTopics(searchTerm) {
        const topicsGrid = document.getElementById('topicsGrid');
        if (!topicsGrid) return;

        const cards = topicsGrid.querySelectorAll('.topic-card');
        const term = searchTerm.toLowerCase();

        cards.forEach(card => {
            const title = card.querySelector('.topic-title').textContent.toLowerCase();
            const desc = card.querySelector('.topic-desc').textContent.toLowerCase();
            
            if (title.includes(term) || desc.includes(term)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    updateProgress() {
        const progressBanner = document.getElementById('progressBanner');
        if (!progressBanner) return;

        const progress = this.storage.getProgress();
        
        if (progress.recentActivity) {
            const activity = progress.recentActivity;
            const timeAgo = this.getTimeAgo(activity.timestamp);
            
            progressBanner.innerHTML = `
                <div class="progress-content">
                    <i class="fas fa-history"></i>
                    <span>Last activity: Completed <strong>${activity.topic}</strong> ${timeAgo}</span>
                </div>
            `;
        }
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const past = new Date(timestamp);
        const diffMs = now - past;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }

    showLoginModal() {
        // Create modal HTML
        const modalHTML = `
            <div class="modal-overlay" id="loginModal">
                <div class="modal">
                    <div class="modal-header">
                        <h3>Sign In to DSA Visual Lab</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>Track your progress, save your work, and earn achievements!</p>
                        <div class="login-options">
                            <button class="btn btn-primary" style="width: 100%; margin-bottom: 1rem;">
                                <i class="fab fa-google"></i> Continue with Google
                            </button>
                            <button class="btn btn-outline" style="width: 100%; margin-bottom: 1rem;">
                                <i class="fab fa-github"></i> Continue with GitHub
                            </button>
                            <div class="divider">
                                <span>or</span>
                            </div>
                            <div class="guest-option">
                                <button class="btn" onclick="app.continueAsGuest()">
                                    Continue as Guest
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add styles for modal
        const style = document.createElement('style');
        style.textContent = `
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            
            .modal {
                background-color: var(--bg-color);
                border-radius: var(--radius-lg);
                width: 90%;
                max-width: 400px;
                box-shadow: var(--shadow-lg);
            }
            
            .modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h3 {
                margin: 0;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                color: var(--text-tertiary);
                cursor: pointer;
            }
            
            .modal-body {
                padding: 1.5rem;
            }
            
            .divider {
                text-align: center;
                margin: 1.5rem 0;
                position: relative;
            }
            
            .divider::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 1px;
                background-color: var(--border-color);
            }
            
            .divider span {
                background-color: var(--bg-color);
                padding: 0 1rem;
                color: var(--text-tertiary);
                position: relative;
            }
            
            .guest-option {
                text-align: center;
                margin-top: 1.5rem;
            }
        `;
        document.head.appendChild(style);

        // Add event listeners
        const modal = document.getElementById('loginModal');
        const closeBtn = modal.querySelector('.modal-close');
        
        closeBtn.addEventListener('click', () => {
            modal.remove();
            style.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                style.remove();
            }
        });
    }

    continueAsGuest() {
        const modal = document.getElementById('loginModal');
        const style = document.head.querySelector('style[data-modal-style]');
        
        if (modal) modal.remove();
        if (style) style.remove();
        
        this.storage.setPreference('user', 'guest');
        alert('Continuing as guest. Your progress will be saved locally.');
    }

    async loadTopicsPage() {
        // Implementation for topics page
        console.log('Loading topics page...');
    }

    async loadVisualizerPage() {
        // Implementation for visualizer page
        console.log('Loading visualizer page...');
    }

    async loadCodeEditorPage() {
        // Implementation for code editor page
        console.log('Loading code editor page...');
    }

    async loadQuizPage() {
        // Implementation for quiz page
        console.log('Loading quiz page...');
    }

    async loadProgressPage() {
        // Implementation for progress page
        console.log('Loading progress page...');
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DSAVisualLab();
});

// Export for module usage
export { DSAVisualLab };
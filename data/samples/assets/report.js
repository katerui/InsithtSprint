/**
 * 調査結果HTMLレポート JavaScript
 * 生成日: 2025-11-02
 * Chart.js初期化・グラフ生成ロジック
 */

// 青系グラデーションカラーパレット
const BLUE_PALETTE = [
    '#1e3a8a',  // blue-900
    '#1d4ed8',  // blue-700
    '#3b82f6',  // blue-500
    '#60a5fa',  // blue-400
    '#93c5fd',  // blue-300
    '#bfdbfe',  // blue-200
    '#dbeafe',  // blue-100
    '#eff6ff'   // blue-50
];

// Chart.jsグローバル設定
Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", "Yu Gothic", sans-serif';
Chart.defaults.font.size = 13;
Chart.defaults.color = '#1f2937';

/**
 * 横棒グラフを生成（定量設問用）
 * @param {string} canvasId - canvas要素のID
 * @param {Array<string>} labels - ラベル配列
 * @param {Array<number>} values - 値配列（パーセンテージ）
 * @param {string} title - グラフタイトル
 */
function createHorizontalBarChart(canvasId, labels, values, title = '') {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.warn(`Canvas element not found: ${canvasId}`);
        return null;
    }

    // データ長に応じた色配列生成
    const colors = labels.map((_, i) => BLUE_PALETTE[i % BLUE_PALETTE.length]);

    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '割合',
                data: values,
                backgroundColor: colors,
                borderWidth: 0,
                barThickness: 30,
                maxBarThickness: 40
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: !!title,
                    text: title,
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#1d4ed8',
                    padding: {
                        bottom: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 58, 138, 0.9)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: (context) => {
                            const value = context.parsed.x;
                            return ` ${value.toFixed(1)}%`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: Math.max(...values) * 1.1,
                    ticks: {
                        callback: (value) => value + '%',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: '#e5e7eb'
                    }
                },
                y: {
                    ticks: {
                        font: {
                            size: 12
                        },
                        autoSkip: false
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

/**
 * ドーナツチャートを生成（FA分析テーマ分布用）
 * @param {string} canvasId - canvas要素のID
 * @param {Array<string>} labels - ラベル配列
 * @param {Array<number>} values - 値配列（件数またはパーセンテージ）
 * @param {string} title - グラフタイトル
 */
function createDoughnutChart(canvasId, labels, values, title = '') {
    const ctx = document.getElementById(canvasId);
    if (!ctx) {
        console.warn(`Canvas element not found: ${canvasId}`);
        return null;
    }

    // データ長に応じた色配列生成
    const colors = labels.map((_, i) => BLUE_PALETTE[i % BLUE_PALETTE.length]);

    return new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#ffffff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        },
                        generateLabels: (chart) => {
                            const data = chart.data;
                            if (data.labels.length && data.datasets.length) {
                                return data.labels.map((label, i) => {
                                    const value = data.datasets[0].data[i];
                                    return {
                                        text: `${label}: ${value}件`,
                                        fillStyle: data.datasets[0].backgroundColor[i],
                                        hidden: false,
                                        index: i
                                    };
                                });
                            }
                            return [];
                        }
                    }
                },
                title: {
                    display: !!title,
                    text: title,
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#1d4ed8',
                    padding: {
                        bottom: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 58, 138, 0.9)',
                    padding: 12,
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return ` ${label}: ${value}件 (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

/**
 * スムーススクロール設定
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // アクティブリンクの更新
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

/**
 * スクロール位置に応じてナビゲーションのアクティブリンクを更新
 */
function setupScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * 初期化処理
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('調査結果HTMLレポート - JavaScript読み込み完了');

    // スムーススクロール設定
    setupSmoothScroll();

    // スクロールスパイ設定
    setupScrollSpy();

    // グラフ生成（データは各HTMLファイルで定義）
    if (typeof initializeCharts === 'function') {
        initializeCharts();
    }

    console.log('初期化完了');
});

// エクスポート（モジュールとして使用する場合）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createHorizontalBarChart,
        createDoughnutChart
    };
}

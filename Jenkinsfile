// ============================================
// PLAYWRIGHT AUTO PIPELINE - JENKINSFILE
// ============================================
// Flow: lint → dev → qa → stage → prod (automatic)
// Trigger: Push, PR, or manual build
// Reports: Separate Allure per environment, Playwright HTML, Custom HTML
// ✅ ESLint static code analysis
// ✅ Separate Allure reports per environment
// ✅ Slack notifications for test results
// ✅ Email notifications with all report links
// ============================================
//
// Required Jenkins Credentials:
// ------------------------------------
// slack-token          - Slack Webhook Token (Secret text)
// ============================================
//
// Required Jenkins Plugins:
// ------------------------------------
// - NodeJS Plugin
// - Allure Jenkins Plugin
// - HTML Publisher Plugin
// - Slack Notification Plugin
// - Email Extension Plugin
// - Pipeline Stage View Plugin
// ============================================

pipeline {
    agent any

    tools {
        nodejs 'NodeJS22'
    }

    environment {
        NODE_VERSION = '22'
        CI = 'true'
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}/.cache/ms-playwright"
        SLACK_WEBHOOK_URL = credentials('SlackWebhook')
        // Email recipients - update these with your actual email addresses
        EMAIL_RECIPIENTS = 'dnarasimha1994@gmail.com'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timestamps()
        timeout(time: 60, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {
        // ============================================
        // Static Code Analysis (ESLint)
        // ============================================
        stage('🔍 ESLint Analysis') {
            steps {
                echo '============================================'
                echo '📥 Installing dependencies...'
                echo '============================================'
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npm ci"'

                echo '============================================'
                echo '📁 Creating ESLint report directory...'
                echo '============================================'
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p eslint-report"'

                echo '============================================'
                echo '🔍 Running ESLint...'
                echo '============================================'
                script {
                    def eslintStatus = bat(
                        script: '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npm run lint"',
                        returnStatus: true
                    )
                    env.ESLINT_STATUS = eslintStatus == 0 ? 'success' : 'failure'
                }

                echo '============================================'
                echo '📊 Generating ESLint HTML Report...'
                echo '============================================'
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npm run lint:report || true"'
            }
            post {
                always {
                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'eslint-report',
                        reportFiles: 'index.html',
                        reportName: 'ESLint Report',
                        reportTitles: 'ESLint Analysis'
                    ])
                    script {
                        if (env.ESLINT_STATUS == 'failure') {
                            echo '⚠️ ESLint found issues - check the HTML report'
                        } else {
                            echo '✅ No ESLint issues found'
                        }
                    }
                }
            }
        }

        // ============================================
        // DEV Environment Tests
        // ============================================
        stage('🔧 DEV Tests') {
            steps {
                echo '============================================'
                echo '🎭 Installing Playwright browsers...'
                echo '============================================'
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npx playwright install --with-deps chromium"'

                echo '============================================'
                echo '🧹 Cleaning previous results...'
                echo '============================================'
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "rm -rf allure-results playwright-report playwright-html-report test-results"'

                echo '============================================'
                echo '🧪 Running DEV tests...'
                echo '============================================'
                script {
                    env.DEV_TEST_STATUS = bat(
                        script: '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npx playwright test tests/loginpage.spec.ts --config=playwright.config.dev.ts"',
                        returnStatus: true
                    ) == 0 ? 'success' : 'failure'
                }

                echo '============================================'
                echo '🏷️ Adding Allure environment info...'
                echo '============================================'
                bat '''"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p allure-results && \
                    echo 'Environment=DEV' > allure-results/environment.properties && \
                    echo 'Browser=Google Chrome' >> allure-results/environment.properties && \
                    echo 'Config=playwright.config.dev.ts' >> allure-results/environment.properties"'''
            }
            post {
                always {
                    bat '''"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p allure-results-dev && \
                        cp -r allure-results/* allure-results-dev/ 2>/dev/null || true && \
                        npx allure generate allure-results-dev --clean -o allure-report-dev || true"'''

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'allure-report-dev',
                        reportFiles: 'index.html',
                        reportName: 'DEV Allure Report',
                        reportTitles: 'DEV Allure Report'
                    ])

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'DEV Playwright Report',
                        reportTitles: 'DEV Playwright Report'
                    ])

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-html-report',
                        reportFiles: 'index.html',
                        reportName: 'DEV HTML Report',
                        reportTitles: 'DEV Custom HTML Report'
                    ])

                    archiveArtifacts artifacts: 'allure-results-dev/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                }
            }
        }

        // ============================================
        // QA, STAGE, PROD stages
        // ============================================

        // QA Stage
        stage('🔍 QA Tests') {
            steps {
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "rm -rf allure-results playwright-report playwright-html-report test-results"'
                script {
                    env.QA_TEST_STATUS = bat(
                        script: '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npx playwright test tests/loginpage.spec.ts --config=playwright.config.qa.ts"',
                        returnStatus: true
                    ) == 0 ? 'success' : 'failure'
                }
                bat '''"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p allure-results && \
                    echo 'Environment=QA' > allure-results/environment.properties && \
                    echo 'Browser=Google Chrome' >> allure-results/environment.properties && \
                    echo 'Config=playwright.config.qa.ts' >> allure-results/environment.properties"'''
            }
            post {
                always {
                    bat '''"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p allure-results-qa && \
                        cp -r allure-results/* allure-results-qa/ 2>/dev/null || true && \
                        npx allure generate allure-results-qa --clean -o allure-report-qa || true"'''

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'allure-report-qa',
                        reportFiles: 'index.html',
                        reportName: 'QA Allure Report',
                        reportTitles: 'QA Allure Report'
                    ])

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'QA Playwright Report',
                        reportTitles: 'QA Playwright Report'
                    ])

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-html-report',
                        reportFiles: 'index.html',
                        reportName: 'QA HTML Report',
                        reportTitles: 'QA Custom HTML Report'
                    ])

                    archiveArtifacts artifacts: 'allure-results-qa/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                }
            }
        }

        // STAGE Stage
        stage('🎯 STAGE Tests') {
            steps {
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "rm -rf allure-results playwright-report playwright-html-report test-results"'
                script {
                    env.STAGE_TEST_STATUS = bat(
                        script: '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npx playwright test tests/loginpage.spec.ts --config=playwright.config.stage.ts"',
                        returnStatus: true
                    ) == 0 ? 'success' : 'failure'
                }
                bat '''"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p allure-results && \
                    echo 'Environment=STAGE' > allure-results/environment.properties && \
                    echo 'Browser=Google Chrome' >> allure-results/environment.properties && \
                    echo 'Config=playwright.config.stage.ts' >> allure-results/environment.properties"'''
            }
            post {
                always {
                    bat '''"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p allure-results-stage && \
                        cp -r allure-results/* allure-results-stage/ 2>/dev/null || true && \
                        npx allure generate allure-results-stage --clean -o allure-report-stage || true"'''

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'allure-report-stage',
                        reportFiles: 'index.html',
                        reportName: 'STAGE Allure Report',
                        reportTitles: 'STAGE Allure Report'
                    ])

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'STAGE Playwright Report',
                        reportTitles: 'STAGE Playwright Report'
                    ])

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-html-report',
                        reportFiles: 'index.html',
                        reportName: 'STAGE HTML Report',
                        reportTitles: 'STAGE Custom HTML Report'
                    ])

                    archiveArtifacts artifacts: 'allure-results-stage/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                }
            }
        }

        // PROD Stage
        stage('🚀 PROD Tests') {
            steps {
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "rm -rf allure-results playwright-report playwright-html-report test-results"'
                script {
                    env.PROD_TEST_STATUS = bat(
                        script: '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npx playwright test tests/loginpage.spec.ts --config=playwright.config.prod.ts"',
                        returnStatus: true
                    ) == 0 ? 'success' : 'failure'
                }
                bat '''"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p allure-results && \
                    echo 'Environment=PROD' > allure-results/environment.properties && \
                    echo 'Browser=Google Chrome' >> allure-results/environment.properties && \
                    echo 'Config=playwright.config.prod.ts' >> allure-results/environment.properties"'''
            }
            post {
                always {
                    bat '''"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p allure-results-prod && \
                        cp -r allure-results/* allure-results-prod/ 2>/dev/null || true && \
                        npx allure generate allure-results-prod --clean -o allure-report-prod || true"'''

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'allure-report-prod',
                        reportFiles: 'index.html',
                        reportName: 'PROD Allure Report',
                        reportTitles: 'PROD Allure Report'
                    ])

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'PROD Playwright Report',
                        reportTitles: 'PROD Playwright Report'
                    ])

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-html-report',
                        reportFiles: 'index.html',
                        reportName: 'PROD HTML Report',
                        reportTitles: 'PROD Custom HTML Report'
                    ])

                    archiveArtifacts artifacts: 'allure-results-prod/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                }
            }
        }

        // ============================================
        // Combined Allure Report
        // ============================================
        stage('📈 Combined Allure Report') {
            steps {
                bat '''"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p allure-results-combined && \
                    cp -r allure-results-dev/* allure-results-combined/ 2>/dev/null || true && \
                    cp -r allure-results-qa/* allure-results-combined/ 2>/dev/null || true && \
                    cp -r allure-results-stage/* allure-results-combined/ 2>/dev/null || true && \
                    cp -r allure-results-prod/* allure-results-combined/ 2>/dev/null || true && \
                    echo 'Environment=ALL (DEV, QA, STAGE, PROD)' > allure-results-combined/environment.properties && \
                    echo 'Browser=Google Chrome' >> allure-results-combined/environment.properties && \
                    echo 'Pipeline=${JOB_NAME}' >> allure-results-combined/environment.properties && \
                    echo 'Build=${BUILD_NUMBER}' >> allure-results-combined/environment.properties"'''
            }
            post {
                always {
                    allure([
                        includeProperties: true,
                        jdk: '',
                        properties: [],
                        reportBuildPolicy: 'ALWAYS',
                        results: [[path: 'allure-results-combined']]
                    ])
                }
            }
        }
    }
	
// ============================================
// Post-Build Notifications (Slack & Email)
// ============================================
post {
    always {
        echo '============================================'
        echo '📬 PIPELINE SUMMARY'
        echo '============================================'

        script {
            // Test statuses
            def devStatus = env.DEV_TEST_STATUS ?: 'unknown'
            def qaStatus = env.QA_TEST_STATUS ?: 'unknown'
            def stageStatus = env.STAGE_TEST_STATUS ?: 'unknown'
            def prodStatus = env.PROD_TEST_STATUS ?: 'unknown'

            // Status emojis
            env.DEV_EMOJI = devStatus == 'success' ? '✅' : (devStatus == 'failure' ? '❌' : '⚠️')
            env.QA_EMOJI = qaStatus == 'success' ? '✅' : (qaStatus == 'failure' ? '❌' : '⚠️')
            env.STAGE_EMOJI = stageStatus == 'success' ? '✅' : (stageStatus == 'failure' ? '❌' : '⚠️')
            env.PROD_EMOJI = prodStatus == 'success' ? '✅' : (prodStatus == 'failure' ? '❌' : '⚠️')

            // Overall pipeline status
            if ([devStatus, qaStatus, stageStatus, prodStatus].contains('failure')) {
                env.OVERALL_STATUS = 'FAILURE'
                env.STATUS_EMOJI = '❌'
                env.STATUS_COLOR = 'danger'
            } else if ([devStatus, qaStatus, stageStatus, prodStatus].contains('unknown')) {
                env.OVERALL_STATUS = 'UNSTABLE'
                env.STATUS_EMOJI = '⚠️'
                env.STATUS_COLOR = 'warning'
            } else {
                env.OVERALL_STATUS = 'SUCCESS'
                env.STATUS_EMOJI = '✅'
                env.STATUS_COLOR = 'good'
            }

            // Base URL
            def baseUrl = env.BUILD_URL

            // Report links for each environment
            env.REPORTS = [
                'DEV': [
                    'allure': "${baseUrl}allure-report-dev",
                    'playwright': "${baseUrl}playwright-report-dev",
                    'html': "${baseUrl}playwright-html-report-dev"
                ],
                'QA': [
                    'allure': "${baseUrl}allure-report-qa",
                    'playwright': "${baseUrl}playwright-report-qa",
                    'html': "${baseUrl}playwright-html-report-qa"
                ],
                'STAGE': [
                    'allure': "${baseUrl}allure-report-stage",
                    'playwright': "${baseUrl}playwright-report-stage",
                    'html': "${baseUrl}playwright-html-report-stage"
                ],
                'PROD': [
                    'allure': "${baseUrl}allure-report-prod",
                    'playwright': "${baseUrl}playwright-report-prod",
                    'html': "${baseUrl}playwright-html-report-prod"
                ]
            ]
        }
    }

    success {
        script { sendNotification('SUCCESS') }
    }
    failure {
        script { sendNotification('FAILURE') }
    }
    unstable {
        script { sendNotification('UNSTABLE') }
    }
}

// ============================================
// Function to send Slack and Email notifications
// ============================================
def sendNotification(status) {
    def statusMap = [
        'SUCCESS': ['color': 'good', 'header': '✅ Playwright Pipeline: All Tests Passed'],
        'FAILURE': ['color': 'danger', 'header': '❌ Playwright Pipeline: Tests Failed'],
        'UNSTABLE': ['color': 'warning', 'header': '⚠️ Playwright Pipeline: Unstable']
    ]

    def color = statusMap[status].color
    def header = statusMap[status].header

    // Slack message
    try {
        slackSend(
            color: color,
            message: """${header}

*Repository:* ${env.JOB_NAME}
*Branch:* ${env.GIT_BRANCH ?: 'N/A'}
*Build:* #${env.BUILD_NUMBER}

*Test Results:*
${env.DEV_EMOJI} DEV: ${env.DEV_TEST_STATUS}
${env.QA_EMOJI} QA: ${env.QA_TEST_STATUS}
${env.STAGE_EMOJI} STAGE: ${env.STAGE_TEST_STATUS}
${env.PROD_EMOJI} PROD: ${env.PROD_TEST_STATUS}

📊 Combined Allure Report: <${env.BUILD_URL}allure|Click Here>
🔗 View Build: <${env.BUILD_URL}|Click Here>
📋 Console Log: <${env.BUILD_URL}console|Click Here>"""
        )
    } catch (Exception e) {
        echo "Slack notification failed: ${e.message}"
    }

    // Email HTML body
    def bodyHtml = """
<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
.container { max-width: 700px; margin: 0 auto; padding: 20px; }
.header { background: ${color=='good'?'#27ae60':color=='danger'?'#e74c3c':'#f39c12'}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
.content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
.status-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
.status-table th, .status-table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
.status-table th { background: #ecf0f1; }
.success { color: #27ae60; font-weight: bold; }
.failure { color: #e74c3c; font-weight: bold; }
.warning { color: #f39c12; font-weight: bold; }
.btn { display: inline-block; padding: 8px 16px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; margin: 3px; font-size: 12px; }
.btn-green { background: #27ae60; }
.btn-orange { background: #f39c12; }
.btn-purple { background: #9b59b6; }
.section-title { background: #34495e; color: white; padding: 10px; margin-top: 20px; border-radius: 5px; }
</style>
</head>
<body>
<div class="container">
    <div class="header"><h1>${header}</h1></div>
    <div class="content">
        <h3>📋 Pipeline Information</h3>
        <table class="status-table">
            <tr><th>Job</th><td>${env.JOB_NAME}</td></tr>
            <tr><th>Build</th><td>#${env.BUILD_NUMBER}</td></tr>
            <tr><th>Branch</th><td>${env.GIT_BRANCH ?: 'N/A'}</td></tr>
        </table>

        <h3>🧪 Test Results by Environment</h3>
        <table class="status-table">
            <tr><th>Environment</th><th>Status</th><th>Allure</th><th>Playwright</th><th>HTML</th></tr>
            <tr>
                <td>DEV</td>
                <td class="${env.DEV_TEST_STATUS=='success'?'success':env.DEV_TEST_STATUS=='failure'?'failure':'warning'}">${env.DEV_TEST_STATUS}</td>
                <td><a href="${env.REPORTS['DEV']['allure']}" class="btn btn-green">Allure</a></td>
                <td><a href="${env.REPORTS['DEV']['playwright']}" class="btn">Playwright</a></td>
                <td><a href="${env.REPORTS['DEV']['html']}" class="btn btn-orange">HTML</a></td>
            </tr>
            <tr>
                <td>QA</td>
                <td class="${env.QA_TEST_STATUS=='success'?'success':env.QA_TEST_STATUS=='failure'?'failure':'warning'}">${env.QA_TEST_STATUS}</td>
                <td><a href="${env.REPORTS['QA']['allure']}" class="btn btn-green">Allure</a></td>
                <td><a href="${env.REPORTS['QA']['playwright']}" class="btn">Playwright</a></td>
                <td><a href="${env.REPORTS['QA']['html']}" class="btn btn-orange">HTML</a></td>
            </tr>
            <tr>
                <td>STAGE</td>
                <td class="${env.STAGE_TEST_STATUS=='success'?'success':env.STAGE_TEST_STATUS=='failure'?'failure':'warning'}">${env.STAGE_TEST_STATUS}</td>
                <td><a href="${env.REPORTS['STAGE']['allure']}" class="btn btn-green">Allure</a></td>
                <td><a href="${env.REPORTS['STAGE']['playwright']}" class="btn">Playwright</a></td>
                <td><a href="${env.REPORTS['STAGE']['html']}" class="btn btn-orange">HTML</a></td>
            </tr>
            <tr>
                <td>PROD</td>
                <td class="${env.PROD_TEST_STATUS=='success'?'success':env.PROD_TEST_STATUS=='failure'?'failure':'warning'}">${env.PROD_TEST_STATUS}</td>
                <td><a href="${env.REPORTS['PROD']['allure']}" class="btn btn-green">Allure</a></td>
                <td><a href="${env.REPORTS['PROD']['playwright']}" class="btn">Playwright</a></td>
                <td><a href="${env.REPORTS['PROD']['html']}" class="btn btn-orange">HTML</a></td>
            </tr>
        </table>

        <div class="section-title">📁 All Reports Dashboard</div>
        <p>
            <a href="${env.BUILD_URL}allure" class="btn btn-green">Combined Allure Report</a>
            <a href="${env.BUILD_URL}eslint-report" class="btn btn-purple">ESLint Report</a>
            <a href="${env.BUILD_URL}" class="btn">View Build</a>
            <a href="${env.BUILD_URL}console" class="btn btn-orange">Console Log</a>
        </p>
    </div>
</div>
</body>
</html>
"""

    // Send Email
    try {
        emailext(
            subject: "${header} - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
            body: bodyHtml,
            mimeType: 'text/html',
            to: env.EMAIL_RECIPIENTS,
            from: 'CI Notifications <mail@naveenautomationlabs.com>',
            replyTo: 'mail@naveenautomationlabs.com'
        )
    } catch (Exception e) {
        echo "Email notification failed: ${e.message}"
    }
}

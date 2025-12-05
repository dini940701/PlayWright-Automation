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
// Post-Build Actions (Notifications)
// ============================================
post {
    always {
        echo '============================================'
        echo '📬 PIPELINE SUMMARY'
        echo '============================================'

        script {
            def devStatus = env.DEV_TEST_STATUS ?: 'unknown'
            def qaStatus = env.QA_TEST_STATUS ?: 'unknown'
            def stageStatus = env.STAGE_TEST_STATUS ?: 'unknown'
            def prodStatus = env.PROD_TEST_STATUS ?: 'unknown'

            def devEmoji = devStatus == 'success' ? '✅' : (devStatus == 'failure' ? '❌' : '⚠️')
            def qaEmoji = qaStatus == 'success' ? '✅' : (qaStatus == 'failure' ? '❌' : '⚠️')
            def stageEmoji = stageStatus == 'success' ? '✅' : (stageStatus == 'failure' ? '❌' : '⚠️')
            def prodEmoji = prodStatus == 'success' ? '✅' : (prodStatus == 'failure' ? '❌' : '⚠️')

            env.OVERALL_STATUS = 'SUCCESS'
            env.STATUS_EMOJI = '✅'
            env.STATUS_COLOR = 'good'

            if ([devStatus, qaStatus, stageStatus, prodStatus].contains('failure')) {
                env.OVERALL_STATUS = 'FAILURE'
                env.STATUS_EMOJI = '❌'
                env.STATUS_COLOR = 'danger'
            } else if ([devStatus, qaStatus, stageStatus, prodStatus].contains('unknown')) {
                env.OVERALL_STATUS = 'UNSTABLE'
                env.STATUS_EMOJI = '⚠️'
                env.STATUS_COLOR = 'warning'
            }

            env.DEV_EMOJI = devEmoji
            env.QA_EMOJI = qaEmoji
            env.STAGE_EMOJI = stageEmoji
            env.PROD_EMOJI = prodEmoji
        }
    }

    success {
        echo '✅ Pipeline completed successfully!'

        script {
            // Slack notification
            try {
                slackSend(
                    color: 'good',
                    message: """✅ *Playwright Pipeline: All Tests Passed*

*Repository:* ${env.JOB_NAME}
*Branch:* ${env.GIT_BRANCH ?: 'N/A'}
*Build:* #${env.BUILD_NUMBER}

*Test Results:*
${env.DEV_EMOJI} DEV: ${env.DEV_TEST_STATUS}
${env.QA_EMOJI} QA: ${env.QA_TEST_STATUS}
${env.STAGE_EMOJI} STAGE: ${env.STAGE_TEST_STATUS}
${env.PROD_EMOJI} PROD: ${env.PROD_TEST_STATUS}

📊 <${env.BUILD_URL}allure|Combined Allure Report>
🔗 <${env.BUILD_URL}|View Build>
📋 <${env.BUILD_URL}console|Console Log>"""
                )
            } catch (Exception e) {
                echo "Slack notification failed: ${e.message}"
            }

            // Email notification for PASSED
            try {
                emailext(
                    subject: "✅ Playwright Tests Passed - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
.container { max-width: 700px; margin: 0 auto; padding: 20px; }
.header { background: #27ae60; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
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
.btn-red { background: #e74c3c; }
.section-title { background: #34495e; color: white; padding: 10px; margin-top: 20px; border-radius: 5px; }
.report-grid { display: table; width: 100%; margin: 10px 0; }
.report-row { display: table-row; }
.report-cell { display: table-cell; padding: 5px; }
</style>
</head>
<body>
<div class="container">
<div class="header"><h1>✅ Playwright Pipeline Results</h1><h2>All Tests Passed</h2></div>
<div class="content">
<h3>📋 Pipeline Information</h3>
<table class="status-table">
<tr><th>Job</th><td>${env.JOB_NAME}</td></tr>
<tr><th>Build</th><td>#${env.BUILD_NUMBER}</td></tr>
<tr><th>Branch</th><td>${env.GIT_BRANCH ?: 'N/A'}</td></tr>
</table>

<h3>🧪 Test Results by Environment</h3>
<table class="status-table">
<tr><th>Environment</th><th>Status</th></tr>
<tr><td>DEV</td><td class="success">${env.DEV_TEST_STATUS}</td></tr>
<tr><td>QA</td><td class="success">${env.QA_TEST_STATUS}</td></tr>
<tr><td>STAGE</td><td class="success">${env.STAGE_TEST_STATUS}</td></tr>
<tr><td>PROD</td><td class="success">${env.PROD_TEST_STATUS}</td></tr>
</table>

<div class="section-title">📁 All Reports</div>
<div class="report-grid">
<div class="report-row">
<div class="report-cell"><a class="btn btn-green" href="${env.BUILD_URL}allure-report-dev">DEV Allure</a></div>
<div class="report-cell"><a class="btn btn-green" href="${env.BUILD_URL}allure-report-qa">QA Allure</a></div>
<div class="report-cell"><a class="btn btn-green" href="${env.BUILD_URL}allure-report-stage">STAGE Allure</a></div>
<div class="report-cell"><a class="btn btn-green" href="${env.BUILD_URL}allure-report-prod">PROD Allure</a></div>
</div>
<div class="report-row">
<div class="report-cell"><a class="btn" href="${env.BUILD_URL}playwright-report">Playwright Report</a></div>
<div class="report-cell"><a class="btn btn-orange" href="${env.BUILD_URL}playwright-html-report">Custom HTML Report</a></div>
</div>
</div>
</div>
</div>
</body>
</html>""",
                    mimeType: 'text/html',
                    to: env.EMAIL_RECIPIENTS,
                    from: 'CI Notifications <mail@naveenautomationlabs.com>',
                    replyTo: 'mail@naveenautomationlabs.com'
                )
            } catch (Exception e) {
                echo "Email notification failed: ${e.message}"
            }
        }
    }

    failure {
        echo '❌ Pipeline failed!'

        script {
            // Slack notification
            try {
                slackSend(
                    color: 'danger',
                    message: """❌ *Playwright Pipeline: Tests Failed*

*Repository:* ${env.JOB_NAME}
*Branch:* ${env.GIT_BRANCH ?: 'N/A'}
*Build:* #${env.BUILD_NUMBER}

*Test Results:*
${env.DEV_EMOJI} DEV: ${env.DEV_TEST_STATUS}
${env.QA_EMOJI} QA: ${env.QA_TEST_STATUS}
${env.STAGE_EMOJI} STAGE: ${env.STAGE_TEST_STATUS}
${env.PROD_EMOJI} PROD: ${env.PROD_TEST_STATUS}

📊 <${env.BUILD_URL}allure|View Allure Report>
🔗 <${env.BUILD_URL}|View Build>"""
                )
            } catch (Exception e) {
                echo "Slack notification failed: ${e.message}"
            }

            // Email notification for FAILED (similar HTML as passed but red)
            try {
                emailext(
                    subject: "❌ Playwright Tests Failed - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
.container { max-width: 700px; margin: 0 auto; padding: 20px; }
.header { background: #e74c3c; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
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
.btn-red { background: #e74c3c; }
.section-title { background: #34495e; color: white; padding: 10px; margin-top: 20px; border-radius: 5px; }
.report-grid { display: table; width: 100%; margin: 10px 0; }
.report-row { display: table-row; }
.report-cell { display: table-cell; padding: 5px; }
</style>
</head>
<body>
<div class="container">
<div class="header"><h1>❌ Playwright Pipeline Results</h1><h2>Tests Failed</h2></div>
<div class="content">
<h3>📋 Pipeline Information</h3>
<table class="status-table">
<tr><th>Job</th><td>${env.JOB_NAME}</td></tr>
<tr><th>Build</th><td>#${env.BUILD_NUMBER}</td></tr>
<tr><th>Branch</th><td>${env.GIT_BRANCH ?: 'N/A'}</td></tr>
</table>

<h3>🧪 Test Results by Environment</h3>
<table class="status-table">
<tr><th>Environment</th><th>Status</th></tr>
<tr><td>DEV</td><td class="failure">${env.DEV_TEST_STATUS}</td></tr>
<tr><td>QA</td><td class="failure">${env.QA_TEST_STATUS}</td></tr>
<tr><td>STAGE</td><td class="failure">${env.STAGE_TEST_STATUS}</td></tr>
<tr><td>PROD</td><td class="failure">${env.PROD_TEST_STATUS}</td></tr>
</table>

<div class="section-title">📁 All Reports</div>
<div class="report-grid">
<div class="report-row">
<div class="report-cell"><a class="btn btn-red" href="${env.BUILD_URL}allure-report-dev">DEV Allure</a></div>
<div class="report-cell"><a class="btn btn-red" href="${env.BUILD_URL}allure-report-qa">QA Allure</a></div>
<div class="report-cell"><a class="btn btn-red" href="${env.BUILD_URL}allure-report-stage">STAGE Allure</a></div>
<div class="report-cell"><a class="btn btn-red" href="${env.BUILD_URL}allure-report-prod">PROD Allure</a></div>
</div>
<div class="report-row">
<div class="report-cell"><a class="btn" href="${env.BUILD_URL}playwright-report">Playwright Report</a></div>
<div class="report-cell"><a class="btn btn-orange" href="${env.BUILD_URL}playwright-html-report">Custom HTML Report</a></div>
</div>
</div>
</div>
</div>
</body>
</html>""",
                    mimeType: 'text/html',
                    to: env.EMAIL_RECIPIENTS,
                    from: 'CI Notifications <mail@naveenautomationlabs.com>',
                    replyTo: 'mail@naveenautomationlabs.com'
                )
            } catch (Exception e) {
                echo "Email notification failed: ${e.message}"
            }
        }
    }

    unstable {
        echo '⚠️ Pipeline completed with warnings!'

        script {
            // Slack notification
            try {
                slackSend(
                    color: 'warning',
                    message: """⚠️ *Playwright Pipeline: Unstable*

*Repository:* ${env.JOB_NAME}
*Branch:* ${env.GIT_BRANCH ?: 'N/A'}
*Build:* #${env.BUILD_NUMBER}

*Test Results:*
${env.DEV_EMOJI} DEV: ${env.DEV_TEST_STATUS}
${env.QA_EMOJI} QA: ${env.QA_TEST_STATUS}
${env.STAGE_EMOJI} STAGE: ${env.STAGE_TEST_STATUS}
${env.PROD_EMOJI} PROD: ${env.PROD_TEST_STATUS}

📊 <${env.BUILD_URL}allure|View Allure Report>
🔗 <${env.BUILD_URL}|View Build>"""
                )
            } catch (Exception e) {
                echo "Slack notification failed: ${e.message}"
            }

            // Email notification for UNSTABLE
            try {
                emailext(
                    subject: "⚠️ Playwright Tests Unstable - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
.container { max-width: 700px; margin: 0 auto; padding: 20px; }
.header { background: #f39c12; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
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
.btn-red { background: #e74c3c; }
.section-title { background: #34495e; color: white; padding: 10px; margin-top: 20px; border-radius: 5px; }
.report-grid { display: table; width: 100%; margin: 10px 0; }
.report-row { display: table-row; }
.report-cell { display: table-cell; padding: 5px; }
</style>
</head>
<body>
<div class="container">
<div class="header"><h1>⚠️ Playwright Pipeline Results</h1><h2>Tests Unstable</h2></div>
<div class="content">
<h3>📋 Pipeline Information</h3>
<table class="status-table">
<tr><th>Job</th><td>${env.JOB_NAME}</td></tr>
<tr><th>Build</th><td>#${env.BUILD_NUMBER}</td></tr>
<tr><th>Branch</th><td>${env.GIT_BRANCH ?: 'N/A'}</td></tr>
</table>

<h3>🧪 Test Results by Environment</h3>
<table class="status-table">
<tr><th>Environment</th><th>Status</th></tr>
<tr><td>DEV</td><td class="warning">${env.DEV_TEST_STATUS}</td></tr>
<tr><td>QA</td><td class="warning">${env.QA_TEST_STATUS}</td></tr>
<tr><td>STAGE</td><td class="warning">${env.STAGE_TEST_STATUS}</td></tr>
<tr><td>PROD</td><td class="warning">${env.PROD_TEST_STATUS}</td></tr>
</table>

<div class="section-title">📁 All Reports</div>
<div class="report-grid">
<div class="report-row">
<div class="report-cell"><a class="btn btn-orange" href="${env.BUILD_URL}allure-report-dev">DEV Allure</a></div>
<div class="report-cell"><a class="btn btn-orange" href="${env.BUILD_URL}allure-report-qa">QA Allure</a></div>
<div class="report-cell"><a class="btn btn-orange" href="${env.BUILD_URL}allure-report-stage">STAGE Allure</a></div>
<div class="report-cell"><a class="btn btn-orange" href="${env.BUILD_URL}allure-report-prod">PROD Allure</a></div>
</div>
<div class="report-row">
<div class="report-cell"><a class="btn" href="${env.BUILD_URL}playwright-report">Playwright Report</a></div>
<div class="report-cell"><a class="btn btn-purple" href="${env.BUILD_URL}playwright-html-report">Custom HTML Report</a></div>
</div>
</div>
</div>
</div>
</body>
</html>""",
                    mimeType: 'text/html',
                    to: env.EMAIL_RECIPIENTS,
                    from: 'CI Notifications <mail@naveenautomationlabs.com>',
                    replyTo: 'mail@naveenautomationlabs.com'
                )
            } catch (Exception e) {
                echo "Email notification failed: ${e.message}"
            }
        }
    }
}
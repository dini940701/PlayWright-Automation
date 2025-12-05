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
        // ESLint Stage
        // ============================================
        stage('🔍 ESLint Analysis') {
            steps {
                echo 'Installing dependencies...'
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npm ci"'

                echo 'Creating ESLint report directory...'
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p eslint-report"'

                echo 'Running ESLint...'
                script {
                    env.ESLINT_STATUS = bat(
                        script: '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npm run lint"',
                        returnStatus: true
                    ) == 0 ? 'success' : 'failure'
                }

                echo 'Generating ESLint HTML Report...'
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
                }
            }
        }

        // ============================================
        // DEV Tests Stage
        // ============================================
        stage('🔧 DEV Tests') {
            steps {
                echo 'Installing Playwright browsers...'
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npx playwright install --with-deps chromium"'

                echo 'Cleaning previous results...'
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "rm -rf allure-results playwright-report playwright-html-report test-results"'

                echo 'Running DEV tests...'
                script {
                    env.DEV_TEST_STATUS = bat(
                        script: '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npx playwright test --config=playwright.config.dev.ts"',
                        returnStatus: true
                    ) == 0 ? 'success' : 'failure'
                }

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
        // QA Stage
        // ============================================
        stage('🔍 QA Tests') {
            steps {
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "rm -rf allure-results playwright-report playwright-html-report test-results"'
                script {
                    env.QA_TEST_STATUS = bat(
                        script: '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npx playwright test --config=playwright.config.qa.ts"',
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

        // ============================================
        // STAGE Stage
        // ============================================
        stage('🎯 STAGE Tests') {
            steps {
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "rm -rf allure-results playwright-report playwright-html-report test-results"'
                script {
                    env.STAGE_TEST_STATUS = bat(
                        script: '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npx playwright test --config=playwright.config.stage.ts"',
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

        // ============================================
        // PROD Stage
        // ============================================
        stage('🚀 PROD Tests') {
            steps {
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "rm -rf allure-results playwright-report playwright-html-report test-results"'
                script {
                    env.PROD_TEST_STATUS = bat(
                        script: '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npx playwright test --config=playwright.config.prod.ts"',
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
    // Post-Build Actions (Slack + Email)
    // ============================================
    post {
        always {
            echo '📬 PIPELINE SUMMARY'

            script {
                def devStatus = env.DEV_TEST_STATUS ?: 'unknown'
                def qaStatus = env.QA_TEST_STATUS ?: 'unknown'
                def stageStatus = env.STAGE_TEST_STATUS ?: 'unknown'
                def prodStatus = env.PROD_TEST_STATUS ?: 'unknown'

                def devEmoji = devStatus == 'success' ? '✅' : '❌'
                def qaEmoji = qaStatus == 'success' ? '✅' : '❌'
                def stageEmoji = stageStatus == 'success' ? '✅' : '❌'
                def prodEmoji = prodStatus == 'success' ? '✅' : '❌'

                env.OVERALL_STATUS = (devStatus=='failure'||qaStatus=='failure'||stageStatus=='failure'||prodStatus=='failure') ? 'FAILURE' :
                                     (devStatus=='unknown'||qaStatus=='unknown'||stageStatus=='unknown'||prodStatus=='unknown') ? 'UNSTABLE' : 'SUCCESS'
                env.STATUS_EMOJI = env.OVERALL_STATUS=='SUCCESS' ? '✅' : (env.OVERALL_STATUS=='FAILURE' ? '❌' : '⚠️')

                env.DEV_EMOJI = devEmoji
                env.QA_EMOJI = qaEmoji
                env.STAGE_EMOJI = stageEmoji
                env.PROD_EMOJI = prodEmoji
            }
        }

        success {
            script {
                slackSend(
                    color: 'good',
                    message: """✅ *Playwright Pipeline: All Tests Passed*
*Repository:* ${env.JOB_NAME}
*Build:* #${env.BUILD_NUMBER}
${env.DEV_EMOJI} DEV: ${env.DEV_TEST_STATUS}
${env.QA_EMOJI} QA: ${env.QA_TEST_STATUS}
${env.STAGE_EMOJI} STAGE: ${env.STAGE_TEST_STATUS}
${env.PROD_EMOJI} PROD: ${env.PROD_TEST_STATUS}
📊 <${env.BUILD_URL}allure|Combined Allure Report>"""
                )

                emailext(
                    subject: "✅ Playwright Tests Passed - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """<!DOCTYPE html>
<html>
<body>
<h2>✅ Playwright Pipeline Results - All Tests Passed</h2>
<h3>📊 Test Results</h3>
<ul>
<li>DEV: ${env.DEV_TEST_STATUS}</li>
<li>QA: ${env.QA_TEST_STATUS}</li>
<li>STAGE: ${env.STAGE_TEST_STATUS}</li>
<li>PROD: ${env.PROD_TEST_STATUS}</li>
</ul>
<div class="section-title">📁 All Reports</div>
<ul>
<li><a href="${env.BUILD_URL}allure-report-dev">DEV Allure</a></li>
<li><a href="${env.BUILD_URL}allure-report-qa">QA Allure</a></li>
<li><a href="${env.BUILD_URL}allure-report-stage">STAGE Allure</a></li>
<li><a href="${env.BUILD_URL}allure-report-prod">PROD Allure</a></li>
<li><a href="${env.BUILD_URL}playwright-report">Playwright Report</a></li>
<li><a href="${env.BUILD_URL}playwright-html-report">Custom HTML Report</a></li>
</ul>
</body>
</html>""",
                    mimeType: 'text/html',
                    to: env.EMAIL_RECIPIENTS
                )
            }
        }

        failure {
            script {
                slackSend(
                    color: 'danger',
                    message: """❌ *Playwright Pipeline: Tests Failed*
*Repository:* ${env.JOB_NAME}
*Build:* #${env.BUILD_NUMBER}"""
                )

                emailext(
                    subject: "❌ Playwright Tests Failed - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """<!DOCTYPE html>
<html>
<body>
<h2>❌ Playwright Pipeline Results - Tests Failed</h2>
<div class="section-title">📁 All Reports</div>
<ul>
<li><a href="${env.BUILD_URL}allure-report-dev">DEV Allure</a></li>
<li><a href="${env.BUILD_URL}allure-report-qa">QA Allure</a></li>
<li><a href="${env.BUILD_URL}allure-report-stage">STAGE Allure</a></li>
<li><a href="${env.BUILD_URL}allure-report-prod">PROD Allure</a></li>
<li><a href="${env.BUILD_URL}playwright-report">Playwright Report</a></li>
<li><a href="${env.BUILD_URL}playwright-html-report">Custom HTML Report</a></li>
</ul>
</body>
</html>""",
                    mimeType: 'text/html',
                    to: env.EMAIL_RECIPIENTS
                )
            }
        }

        unstable {
            script {
                slackSend(
                    color: 'warning',
                    message: """⚠️ *Playwright Pipeline: Tests Unstable*
*Repository:* ${env.JOB_NAME}
*Build:* #${env.BUILD_NUMBER}"""
                )

                emailext(
                    subject: "⚠️ Playwright Tests Unstable - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """<!DOCTYPE html>
<html>
<body>
<h2>⚠️ Playwright Pipeline Results - Unstable</h2>
<div class="section-title">📁 All Reports</div>
<ul>
<li><a href="${env.BUILD_URL}allure-report-dev">DEV Allure</a></li>
<li><a href="${env.BUILD_URL}allure-report-qa">QA Allure</a></li>
<li><a href="${env.BUILD_URL}allure-report-stage">STAGE Allure</a></li>
<li><a href="${env.BUILD_URL}allure-report-prod">PROD Allure</a></li>
<li><a href="${env.BUILD_URL}playwright-report">Playwright Report</a></li>
<li><a href="${env.BUILD_URL}playwright-html-report">Custom HTML Report</a></li>
</ul>
</body>
</html>""",
                    mimeType: 'text/html',
                    to: env.EMAIL_RECIPIENTS
                )
            }
        }
    }
}

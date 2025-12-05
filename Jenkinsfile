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
        stage('🔍 ESLint Analysis') {
            steps {
                echo 'Installing dependencies...'
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npm ci"'

                echo 'Creating ESLint report directory...'
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p eslint-report"'

                echo 'Running ESLint...'
                script {
                    def eslintStatus = bat(
                        script: '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npm run lint"',
                        returnStatus: true
                    )
                    env.ESLINT_STATUS = eslintStatus == 0 ? 'Passed' : 'Failed'
                }

                echo 'Generating ESLint HTML report...'
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

        stage('🔧 DEV Tests') {
            steps {
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npx playwright install --with-deps chromium"'
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "rm -rf allure-results playwright-report playwright-html-report test-results"'
                script {
                    def status = bat(
                        script: '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npx playwright test tests/loginpage.spec.ts --config=playwright.config.dev.ts"',
                        returnStatus: true
                    )
                    env.DEV_TEST_STATUS = status == 0 ? 'Passed' : 'Failed'
                }
                bat '''"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p allure-results && \
                    echo 'Environment=DEV' > allure-results/environment.properties && \
                    echo 'Browser=Google Chrome' >> allure-results/environment.properties && \
                    echo 'Config=playwright.config.dev.ts' >> allure-results/environment.properties"'''
            }
            post {
                always {
                    bat '''"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p allure-results-dev && \
                        cp -r allure-results/* allure-results-dev/ || true && \
                        npx allure generate allure-results-dev --clean -o allure-report-dev || true"'''

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'allure-report-dev',
                        reportFiles: 'index.html',
                        reportName: 'DEV Allure Report'
                    ])

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'DEV Playwright Report'
                    ])

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-html-report',
                        reportFiles: 'index.html',
                        reportName: 'DEV HTML Report'
                    ])

                    archiveArtifacts artifacts: 'allure-results-dev/**/*', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'test-results/**/*', allowEmptyArchive: true
                }
            }
        }

        stage('🔍 QA Tests') {
            steps {
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "rm -rf allure-results playwright-report playwright-html-report test-results"'
                script {
                    def status = bat(
                        script: '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npx playwright test tests/loginpage.spec.ts --config=playwright.config.qa.ts"',
                        returnStatus: true
                    )
                    env.QA_TEST_STATUS = status == 0 ? 'Passed' : 'Failed'
                }
                bat '''"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p allure-results && \
                    echo 'Environment=QA' > allure-results/environment.properties && \
                    echo 'Browser=Google Chrome' >> allure-results/environment.properties && \
                    echo 'Config=playwright.config.qa.ts' >> allure-results/environment.properties"'''
            }
            post {
                always {
                    bat '''"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p allure-results-qa && \
                        cp -r allure-results/* allure-results-qa/ || true && \
                        npx allure generate allure-results-qa --clean -o allure-report-qa || true"'''

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'allure-report-qa',
                        reportFiles: 'index.html',
                        reportName: 'QA Allure Report'
                    ])
                }
            }
        }

        stage('🎯 STAGE Tests') {
            steps {
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "rm -rf allure-results playwright-report playwright-html-report test-results"'
                script {
                    def status = bat(
                        script: '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npx playwright test tests/loginpage.spec.ts --config=playwright.config.stage.ts"',
                        returnStatus: true
                    )
                    env.STAGE_TEST_STATUS = status == 0 ? 'Passed' : 'Failed'
                }
                bat '''"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p allure-results && \
                    echo 'Environment=STAGE' > allure-results/environment.properties && \
                    echo 'Browser=Google Chrome' >> allure-results/environment.properties && \
                    echo 'Config=playwright.config.stage.ts' >> allure-results/environment.properties"'''
            }
            post {
                always {
                    bat '''"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p allure-results-stage && \
                        cp -r allure-results/* allure-results-stage/ || true && \
                        npx allure generate allure-results-stage --clean -o allure-report-stage || true"'''

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'allure-report-stage',
                        reportFiles: 'index.html',
                        reportName: 'STAGE Allure Report'
                    ])
                }
            }
        }

        stage('🚀 PROD Tests') {
            steps {
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "rm -rf allure-results playwright-report playwright-html-report test-results"'
                script {
                    def status = bat(
                        script: '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npx playwright test tests/loginpage.spec.ts --config=playwright.config.prod.ts"',
                        returnStatus: true
                    )
                    env.PROD_TEST_STATUS = status == 0 ? 'Passed' : 'Failed'
                }
                bat '''"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p allure-results && \
                    echo 'Environment=PROD' > allure-results/environment.properties && \
                    echo 'Browser=Google Chrome' >> allure-results/environment.properties && \
                    echo 'Config=playwright.config.prod.ts' >> allure-results/environment.properties"'''
            }
            post {
                always {
                    bat '''"C:\\Program Files\\Git\\bin\\bash.exe" -c "mkdir -p allure-results-prod && \
                        cp -r allure-results/* allure-results-prod/ || true && \
                        npx allure generate allure-results-prod --clean -o allure-report-prod || true"'''

                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'allure-report-prod',
                        reportFiles: 'index.html',
                        reportName: 'PROD Allure Report'
                    ])
                }
            }
        }

        stage('📈 Combined Allure Report') {
            steps {
                bat 'mkdir allure-results-combined || echo "exists"'
                bat 'xcopy /E /I allure-results-dev allure-results-combined'
                bat 'xcopy /E /I allure-results-qa allure-results-combined'
                bat 'xcopy /E /I allure-results-stage allure-results-combined'
                bat 'xcopy /E /I allure-results-prod allure-results-combined'
                bat '''
                echo Environment=ALL (DEV, QA, STAGE, PROD) > allure-results-combined/environment.properties
                echo Browser=Chrome >> allure-results-combined/environment.properties
                echo Pipeline=%JOB_NAME% >> allure-results-combined/environment.properties
                echo Build=%BUILD_NUMBER% >> allure-results-combined/environment.properties
                '''
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

    post {
        always {
            script {
                // Function to convert status to emoji
                def statusEmoji(status) {
                    if (status == 'Passed') return '✅'
                    if (status == 'Failed') return '❌'
                    return '⚠️'
                }

                def devEmoji = statusEmoji(env.DEV_TEST_STATUS)
                def qaEmoji = statusEmoji(env.QA_TEST_STATUS)
                def stageEmoji = statusEmoji(env.STAGE_TEST_STATUS)
                def prodEmoji = statusEmoji(env.PROD_TEST_STATUS)

                env.OVERALL_STATUS = ([env.DEV_TEST_STATUS, env.QA_TEST_STATUS, env.STAGE_TEST_STATUS, env.PROD_TEST_STATUS].contains('Failed')) ? 'FAILED' : 'PASSED'
                def statusColor = env.OVERALL_STATUS == 'FAILED' ? 'danger' : 'good'
                def overallEmoji = env.OVERALL_STATUS == 'FAILED' ? '❌' : '✅'

                // Email body HTML
                def emailBody = """<!DOCTYPE html>
<html>
<head><style>
body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
.container { max-width: 700px; margin: 0 auto; padding: 20px; }
.header { background: #34495e; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
.content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
.status-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
.status-table th, .status-table td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
.status-table th { background: #ecf0f1; }
.success { color: #27ae60; font-weight: bold; }
.failure { color: #e74c3c; font-weight: bold; }
.warning { color: #f39c12; font-weight: bold; }
.btn { display: inline-block; padding: 6px 12px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; margin: 3px; font-size: 12px; }
.btn-green { background: #27ae60; }
.btn-orange { background: #f39c12; }
.section-title { background: #34495e; color: white; padding: 10px; margin-top: 20px; border-radius: 5px; }
</style></head>
<body>
<div class="container">
<div class="header">
<h1>${overallEmoji} Playwright Pipeline Results</h1>
<h2>${env.OVERALL_STATUS}</h2>
</div>
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
<tr><td>DEV</td><td>${devEmoji} ${env.DEV_TEST_STATUS}</td></tr>
<tr><td>QA</td><td>${qaEmoji} ${env.QA_TEST_STATUS}</td></tr>
<tr><td>STAGE</td><td>${stageEmoji} ${env.STAGE_TEST_STATUS}</td></tr>
<tr><td>PROD</td><td>${prodEmoji} ${env.PROD_TEST_STATUS}</td></tr>
</table>

<div class="section-title">📁 All Reports</div>
<table class="status-table">
<tr><th>Report Type</th><th>DEV</th><th>QA</th><th>STAGE</th><th>PROD</th></tr>
<tr><td><strong>Allure</strong></td>
<td><a href="${BUILD_URL}allure-report-dev" class="btn btn-green">View</a></td>
<td><a href="${BUILD_URL}allure-report-qa" class="btn btn-green">View</a></td>
<td><a href="${BUILD_URL}allure-report-stage" class="btn btn-green">View</a></td>
<td><a href="${BUILD_URL}allure-report-prod" class="btn btn-green">View</a></td></tr>
<tr><td><strong>Playwright</strong></td>
<td><a href="${BUILD_URL}playwright-report" class="btn">View</a></td>
<td><a href="${BUILD_URL}playwright-report" class="btn">View</a></td>
<td><a href="${BUILD_URL}playwright-report" class="btn">View</a></td>
<td><a href="${BUILD_URL}playwright-report" class="btn">View</a></td></tr>
<tr><td><strong>Custom HTML</strong></td>
<td><a href="${BUILD_URL}playwright-html-report" class="btn btn-orange">View</a></td>
<td><a href="${BUILD_URL}playwright-html-report" class="btn btn-orange">View</a></td>
<td><a href="${BUILD_URL}playwright-html-report" class="btn btn-orange">View</a></td>
<td><a href="${BUILD_URL}playwright-html-report" class="btn btn-orange">View</a></td></tr>
</table>

</div></div></body></html>
"""

                emailext(
                    to: "${EMAIL_RECIPIENTS}",
                    subject: "[${env.OVERALL_STATUS}] Playwright Pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: emailBody,
                    mimeType: 'text/html'
                )

                slackSend(
                    channel: '#your-channel',
                    color: statusColor,
                    message: """${overallEmoji} Pipeline ${env.OVERALL_STATUS}

*DEV:* ${devEmoji} <${BUILD_URL}allure-report-dev|Allure> | <${BUILD_URL}playwright-report|Playwright> | <${BUILD_URL}playwright-html-report|HTML>
*QA:* ${qaEmoji} <${BUILD_URL}allure-report-qa|Allure> | <${BUILD_URL}playwright-report|Playwright> | <${BUILD_URL}playwright-html-report|HTML>
*STAGE:* ${stageEmoji} <${BUILD_URL}allure-report-stage|Allure> | <${BUILD_URL}playwright-report|Playwright> | <${BUILD_URL}playwright-html-report|HTML>
*PROD:* ${prodEmoji} <${BUILD_URL}allure-report-prod|Allure> | <${BUILD_URL}playwright-report|Playwright> | <${BUILD_URL}playwright-html-report|HTML>
"""
                )
            }
        }
    }
}

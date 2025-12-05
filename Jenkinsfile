// ============================================
// PLAYWRIGHT AUTO PIPELINE - JENKINSFILE
// ============================================

pipeline {
    agent any

    tools { nodejs 'NodeJS22' }

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
        // ESLint Analysis
        // ============================================
        stage('🔍 ESLint Analysis') {
            steps {
                echo '📥 Installing dependencies...'
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npm ci"'

                echo '🔍 Running ESLint...'
                script {
                    env.ESLINT_STATUS = bat(
                        script: '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npm run lint"',
                        returnStatus: true
                    ) == 0 ? 'success' : 'failure'
                }

                echo '📊 Generating ESLint HTML Report...'
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npm run lint:report || true"'
            }
            post {
                always {
                    publishHTML(target: [
                        allowMissing:true, alwaysLinkToLastBuild:true, keepAll:true,
                        reportDir:'eslint-report', reportFiles:'index.html', reportName:'ESLint Report'
                    ])
                    script { echo env.ESLINT_STATUS=='failure'?'⚠️ ESLint issues found':'✅ No ESLint issues' }
                }
            }
        }

        // ============================================
        // DEV Tests (full structure like your file)
        // ============================================
        stage('🔧 DEV Tests') {
            steps {
                echo '🎭 Installing Playwright browsers...'
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npx playwright install --with-deps chromium"'

                echo '🧹 Cleaning previous results...'
                bat '"C:\\Program Files\\Git\\bin\\bash.exe" -c "rm -rf allure-results playwright-report playwright-html-report test-results"'

                echo '🧪 Running DEV tests...'
                script {
                    env.DEV_TEST_STATUS = bat(
                        script: '"C:\\Program Files\\Git\\bin\\bash.exe" -c "npx playwright test tests/loginpage.spec.ts --config=playwright.config.dev.ts"',
                        returnStatus: true
                    ) == 0 ? 'success' : 'failure'
                }

                echo '🏷️ Adding Allure environment info...'
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
                        allowMissing:true, alwaysLinkToLastBuild:true, keepAll:true,
                        reportDir:'allure-report-dev', reportFiles:'index.html', reportName:'DEV Allure Report'
                    ])
                    publishHTML(target: [
                        allowMissing:true, alwaysLinkToLastBuild:true, keepAll:true,
                        reportDir:'playwright-report', reportFiles:'index.html', reportName:'DEV Playwright Report'
                    ])
                    publishHTML(target: [
                        allowMissing:true, alwaysLinkToLastBuild:true, keepAll:true,
                        reportDir:'playwright-html-report', reportFiles:'index.html', reportName:'DEV HTML Report'
                    ])
                    archiveArtifacts artifacts:'allure-results-dev/**/*', allowEmptyArchive:true
                    archiveArtifacts artifacts:'test-results/**/*', allowEmptyArchive:true
                }
            }
        }

        // ============================================
        // QA Tests (identical structure)
        // ============================================
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
                        allowMissing:true, alwaysLinkToLastBuild:true, keepAll:true,
                        reportDir:'allure-report-qa', reportFiles:'index.html', reportName:'QA Allure Report'
                    ])
                    publishHTML(target: [
                        allowMissing:true, alwaysLinkToLastBuild:true, keepAll:true,
                        reportDir:'playwright-report', reportFiles:'index.html', reportName:'QA Playwright Report'
                    ])
                    publishHTML(target: [
                        allowMissing:true, alwaysLinkToLastBuild:true, keepAll:true,
                        reportDir:'playwright-html-report', reportFiles:'index.html', reportName:'QA HTML Report'
                    ])
                    archiveArtifacts artifacts:'allure-results-qa/**/*', allowEmptyArchive:true
                    archiveArtifacts artifacts:'test-results/**/*', allowEmptyArchive:true
                }
            }
        }

        // ============================================
        // STAGE Tests (identical structure)
        // ============================================
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
                        allowMissing:true, alwaysLinkToLastBuild:true, keepAll:true,
                        reportDir:'allure-report-stage', reportFiles:'index.html', reportName:'STAGE Allure Report'
                    ])
                    publishHTML(target: [
                        allowMissing:true, alwaysLinkToLastBuild:true, keepAll:true,
                        reportDir:'playwright-report', reportFiles:'index.html', reportName:'STAGE Playwright Report'
                    ])
                    publishHTML(target: [
                        allowMissing:true, alwaysLinkToLastBuild:true, keepAll:true,
                        reportDir:'playwright-html-report', reportFiles:'index.html', reportName:'STAGE HTML Report'
                    ])
                    archiveArtifacts artifacts:'allure-results-stage/**/*', allowEmptyArchive:true
                    archiveArtifacts artifacts:'test-results/**/*', allowEmptyArchive:true
                }
            }
        }

        // ============================================
        // PROD Tests (identical structure)
        // ============================================
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
                        allowMissing:true, alwaysLinkToLastBuild:true, keepAll:true,
                        reportDir:'allure-report-prod', reportFiles:'index.html', reportName:'PROD Allure Report'
                    ])
                    publishHTML(target: [
                        allowMissing:true, alwaysLinkToLastBuild:true, keepAll:true,
                        reportDir:'playwright-report', reportFiles:'index.html', reportName:'PROD Playwright Report'
                    ])
                    publishHTML(target: [
                        allowMissing:true, alwaysLinkToLastBuild:true, keepAll:true,
                        reportDir:'playwright-html-report', reportFiles:'index.html', reportName:'PROD HTML Report'
                    ])
                    archiveArtifacts artifacts:'allure-results-prod/**/*', allowEmptyArchive:true
                    archiveArtifacts artifacts:'test-results/**/*', allowEmptyArchive:true
                }
            }
        }

        // ============================================
        // Combined Allure
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
                    allure([includeProperties:true, results:[[path:'allure-results-combined']], reportBuildPolicy:'ALWAYS'])
                }
            }
        }
    }

    // ============================================
    // Post Build - Slack & Email Notifications
    // ============================================
    post {
        always {
            script {
                env.DEV_EMOJI = env.DEV_TEST_STATUS=='success'?'✅':env.DEV_TEST_STATUS=='failure'?'❌':'⚠️'
                env.QA_EMOJI = env.QA_TEST_STATUS=='success'?'✅':env.QA_TEST_STATUS=='failure'?'❌':'⚠️'
                env.STAGE_EMOJI = env.STAGE_TEST_STATUS=='success'?'✅':env.STAGE_TEST_STATUS=='failure'?'❌':'⚠️'
                env.PROD_EMOJI = env.PROD_TEST_STATUS=='success'?'✅':env.PROD_TEST_STATUS=='failure'?'❌':'⚠️'

                env.OVERALL_STATUS = (env.DEV_TEST_STATUS=='failure'||env.QA_TEST_STATUS=='failure'||env.STAGE_TEST_STATUS=='failure'||env.PROD_TEST_STATUS=='failure')?'FAILURE':
                                     (env.DEV_TEST_STATUS=='unknown'||env.QA_TEST_STATUS=='unknown'||env.STAGE_TEST_STATUS=='unknown'||env.PROD_TEST_STATUS=='unknown')?'UNSTABLE':'SUCCESS'
                env.STATUS_COLOR = env.OVERALL_STATUS=='FAILURE'?'danger':env.OVERALL_STATUS=='UNSTABLE'?'warning':'good'
            }
        }

        success { script { notifySlackAndEmail("passed") } }
        failure { script { notifySlackAndEmail("failed") } }
        unstable { script { notifySlackAndEmail("unstable") } }
    }
}

// ============================================
// Function to send Slack and Email
// ============================================
def notifySlackAndEmail(status) {
    def statusText = status=='passed'?'✅ Pipeline Passed':status=='failed'?'❌ Pipeline Failed':'⚠️ Pipeline Unstable'
    slackSend(
        color: status=='passed'?'good':status=='failed'?'danger':'warning',
        message: """${statusText}

*Repository:* ${env.JOB_NAME}
*Branch:* ${env.GIT_BRANCH ?: 'N/A'}
*Build:* #${env.BUILD_NUMBER}

*Test Results:*
${env.DEV_EMOJI} DEV: ${env.DEV_TEST_STATUS}
${env.QA_EMOJI} QA: ${env.QA_TEST_STATUS}
${env.STAGE_EMOJI} STAGE: ${env.STAGE_TEST_STATUS}
${env.PROD_EMOJI} PROD: ${env.PROD_TEST_STATUS}

📊 <${env.BUILD_URL}allure|Combined Allure Dashboard>
🔗 <${env.BUILD_URL}|View Build>
📋 <${env.BUILD_URL}console|Console Log>"""
    )

    emailext(
        subject: "${statusText} - ${env.JOB_NAME} #${env.BUILD_NUMBER}",
        body: """<html><body>
<p>Dear Team,</p>
<p>The Playwright pipeline has completed. Please find test results below:</p>

<table border="1" cellpadding="5" cellspacing="0">
<tr><th>Environment</th><th>Status</th><th>Allure</th><th>Playwright</th><th>HTML</th></tr>
<tr><td>DEV</td><td>${env.DEV_TEST_STATUS}</td><td><a href="${env.BUILD_URL}allure-report-dev">Allure</a></td><td><a href="${env.BUILD_URL}playwright-report">Playwright</a></td><td><a href="${env.BUILD_URL}playwright-html-report">HTML</a></td></tr>
<tr><td>QA</td><td>${env.QA_TEST_STATUS}</td><td><a href="${env.BUILD_URL}allure-report-qa">Allure</a></td><td><a href="${env.BUILD_URL}playwright-report">Playwright</a></td><td><a href="${env.BUILD_URL}playwright-html-report">HTML</a></td></tr>
<tr><td>STAGE</td><td>${env.STAGE_TEST_STATUS}</td><td><a href="${env.BUILD_URL}allure-report-stage">Allure</a></td><td><a href="${env.BUILD_URL}playwright-report">Playwright</a></td><td><a href="${env.BUILD_URL}playwright-html-report">HTML</a></td></tr>
<tr><td>PROD</td><td>${env.PROD_TEST_STATUS}</td><td><a href="${env.BUILD_URL}allure-report-prod">Allure</a></td><td><a href="${env.BUILD_URL}playwright-report">Playwright</a></td><td><a href="${env.BUILD_URL}playwright-html-report">HTML</a></td></tr>
</table>

<p>📊 <a href="${env.BUILD_URL}allure">Combined Allure Dashboard</a></p>
<p>Best Regards,<br>CI Automation Team</p>
</body></html>""",
        mimeType: 'text/html',
        to: env.EMAIL_RECIPIENTS,
        from: 'CI Notifications <mail@naveenautomationlabs.com>'
    )
}

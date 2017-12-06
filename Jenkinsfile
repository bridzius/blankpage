pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install') {
          steps {
            sh 'npm install'
          }
        }
        stage('Verify') {
            steps {
                sh 'npm run verify'
            }
        }
        stage('Test') {
            steps {
                sh 'npm run test'
            }
        }
    }
}
#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Cores para output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, type = 'info') {
  const color = type === 'success' ? colors.green 
              : type === 'warning' ? colors.yellow 
              : type === 'error' ? colors.red 
              : colors.bright;
  
  console.log(`${color}${message}${colors.reset}`);
}

// Verifica dependências
function checkDependencies() {
  log('Verificando dependências...', 'info');
  try {
    execSync('npm list', { stdio: 'ignore' });
    log('✓ Dependências OK', 'success');
  } catch (error) {
    log('⚠ Problemas com dependências encontrados', 'warning');
    log('Executando npm install...', 'info');
    execSync('npm install', { stdio: 'inherit' });
  }
}

// Verifica configuração
function checkConfig() {
  log('Verificando configuração...', 'info');
  
  if (!fs.existsSync('.env')) {
    log('⚠ Arquivo .env não encontrado', 'warning');
    log('Criando .env a partir do exemplo...', 'info');
    fs.copyFileSync('.env.example', '.env');
    log('✓ Arquivo .env criado', 'success');
  }
}

// Limpa cache e arquivos temporários
function cleanProject() {
  log('Limpando projeto...', 'info');
  
  const dirsToClean = [
    'node_modules/.cache',
    'dist',
    '.turbo',
  ];

  dirsToClean.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true });
      log(`✓ ${dir} removido`, 'success');
    }
  });
}

// Verifica tipos
function checkTypes() {
  log('Verificando tipos...', 'info');
  try {
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    log('✓ Tipos OK', 'success');
  } catch (error) {
    log('✕ Erros de tipo encontrados', 'error');
    process.exit(1);
  }
}

// Função principal
function main() {
  log('🚀 Iniciando setup do projeto...', 'info');
  
  checkDependencies();
  checkConfig();
  cleanProject();
  checkTypes();
  
  log('✨ Setup concluído com sucesso!', 'success');
}

main();
#!/bin/bash

# Script de gerenciamento do SGH Docker

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir ajuda
show_help() {
    echo -e "${BLUE}SGH - Sistema de Gestão Hospitalar${NC}"
    echo -e "${BLUE}====================================${NC}"
    echo ""
    echo "Uso: ./sgh.sh [COMANDO]"
    echo ""
    echo "Comandos disponíveis:"
    echo -e "  ${GREEN}start${NC}     - Iniciar todos os serviços"
    echo -e "  ${GREEN}stop${NC}      - Parar todos os serviços"
    echo -e "  ${GREEN}restart${NC}   - Reiniciar todos os serviços"
    echo -e "  ${GREEN}build${NC}     - Construir todas as imagens"
    echo -e "  ${GREEN}logs${NC}      - Exibir logs de todos os serviços"
    echo -e "  ${GREEN}status${NC}    - Verificar status dos containers"
    echo -e "  ${GREEN}clean${NC}     - Limpar containers e imagens não utilizadas"
    echo -e "  ${GREEN}reset${NC}     - Parar tudo e remover volumes"
    echo -e "  ${GREEN}backend${NC}   - Executar apenas o backend"
    echo -e "  ${GREEN}frontend${NC}  - Executar apenas o frontend"
    echo -e "  ${GREEN}shell-be${NC}  - Acessar shell do backend"
    echo -e "  ${GREEN}shell-fe${NC}  - Acessar shell do frontend"
    echo -e "  ${GREEN}help${NC}      - Exibir esta ajuda"
    echo ""
}

# Função para verificar se Docker está rodando
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo -e "${RED}❌ Docker não está rodando!${NC}"
        echo "Por favor, inicie o Docker e tente novamente."
        exit 1
    fi
}

# Função para exibir status
show_status() {
    echo -e "${BLUE}📊 Status dos containers:${NC}"
    docker-compose ps
    echo ""
    echo -e "${BLUE}🌐 URLs disponíveis:${NC}"
    echo -e "  Frontend: ${GREEN}http://localhost${NC}"
    echo -e "  Backend:  ${GREEN}http://localhost:3000${NC}"
    echo ""
}

# Verificar se docker-compose.yml existe
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ Arquivo docker-compose.yml não encontrado!${NC}"
    echo "Certifique-se de estar na pasta raiz do projeto."
    exit 1
fi

# Verificar Docker
check_docker

# Processar comandos
case "$1" in
    "start")
        echo -e "${BLUE}🚀 Iniciando SGH...${NC}"
        docker-compose up -d --build
        echo -e "${GREEN}✅ SGH iniciado com sucesso!${NC}"
        show_status
        ;;
    
    "stop")
        echo -e "${YELLOW}⏹️  Parando SGH...${NC}"
        docker-compose down
        echo -e "${GREEN}✅ SGH parado com sucesso!${NC}"
        ;;
    
    "restart")
        echo -e "${YELLOW}🔄 Reiniciando SGH...${NC}"
        docker-compose down
        docker-compose up -d --build
        echo -e "${GREEN}✅ SGH reiniciado com sucesso!${NC}"
        show_status
        ;;
    
    "build")
        echo -e "${BLUE}🔨 Construindo imagens...${NC}"
        docker-compose build
        echo -e "${GREEN}✅ Imagens construídas com sucesso!${NC}"
        ;;
    
    "logs")
        echo -e "${BLUE}📋 Logs do SGH:${NC}"
        docker-compose logs -f --tail=100
        ;;
    
    "status")
        show_status
        ;;
    
    "clean")
        echo -e "${YELLOW}🧹 Limpando containers e imagens não utilizadas...${NC}"
        docker-compose down
        docker system prune -f
        echo -e "${GREEN}✅ Limpeza concluída!${NC}"
        ;;
    
    "reset")
        echo -e "${RED}🗑️  Removendo tudo (containers, volumes, redes)...${NC}"
        read -p "Tem certeza? Isso removerá todos os dados! (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v --remove-orphans
            docker system prune -a -f
            echo -e "${GREEN}✅ Reset completo realizado!${NC}"
        else
            echo -e "${YELLOW}⚠️  Operação cancelada.${NC}"
        fi
        ;;
    
    "backend")
        echo -e "${BLUE}🔧 Iniciando apenas o backend...${NC}"
        docker-compose up backend --build
        ;;
    
    "frontend")
        echo -e "${BLUE}🎨 Iniciando apenas o frontend...${NC}"
        docker-compose up frontend --build
        ;;
    
    "shell-be")
        echo -e "${BLUE}🐚 Acessando shell do backend...${NC}"
        docker-compose exec backend sh
        ;;
    
    "shell-fe")
        echo -e "${BLUE}🐚 Acessando shell do frontend...${NC}"
        docker-compose exec frontend sh
        ;;
    
    "help"|"-h"|"--help"|"")
        show_help
        ;;
    
    *)
        echo -e "${RED}❌ Comando inválido: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac

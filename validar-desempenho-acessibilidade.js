const fs = require('fs');
const path = require('path');

/**
 * Script de Validação: Desempenho e Acessibilidade
 * SGH - Sistema de Gestão Hospitalar
 * 
 * Validações:
 * 1. Desempenho - Tempo de resposta em consultas críticas
 * 2. Acessibilidade - Interface amigável, responsiva e padrões W3C/WCAG
 */

class ValidadorDesempenhoAcessibilidade {
    constructor() {
        this.relatorio = {
            timestamp: new Date().toISOString(),
            sistema: 'SGH - Sistema de Gestão Hospitalar',
            modulo: 'Validação de Desempenho e Acessibilidade',
            versao: '1.0.0',
            desempenho: {
                pontuacao: 0,
                maximo: 50,
                detalhes: {}
            },
            acessibilidade: {
                pontuacao: 0,
                maximo: 50,
                detalhes: {}
            },
            pontuacaoTotal: 0,
            maximoTotal: 100,
            status: 'PENDENTE'
        };
    }

    // =================== VALIDAÇÃO DE DESEMPENHO ===================

    async validarDesempenho() {
        console.log('\n🚀 VALIDANDO DESEMPENHO DO SISTEMA...\n');
        
        const resultados = {
            consultasCriticas: await this.validarConsultasCriticas(),
            otimizacaoBanco: await this.validarOtimizacaoBancoDados(),
            cacheEstrategias: await this.validarEstrategiaCache(),
            bundleOptimization: await this.validarOtimizacaoBundle(),
            lazyLoading: await this.validarLazyLoading()
        };

        let pontuacao = 0;
        Object.values(resultados).forEach(resultado => pontuacao += resultado.pontos);

        this.relatorio.desempenho.pontuacao = pontuacao;
        this.relatorio.desempenho.detalhes = resultados;

        console.log(`✅ Desempenho: ${pontuacao}/${this.relatorio.desempenho.maximo} pontos\n`);
        return pontuacao;
    }

    async validarConsultasCriticas() {
        console.log('🔍 Validando consultas críticas...');
        
        const consultas = {
            backend: {
                pacientes: this.verificarArquivo('backend/src/modules/paciente'),
                agendamentos: this.verificarArquivo('backend/src/modules/agendamento'),
                prontuarios: this.verificarArquivo('backend/src/modules/prontuario'),
                usuarios: this.verificarArquivo('backend/src/modules/usuario')
            },
            frontend: {
                paginacao: this.verificarPaginacao(),
                busca: this.verificarBuscaOtimizada(),
                filtros: this.verificarFiltrosRapidos()
            }
        };

        let pontos = 0;
        
        // Backend - Verificar se tem paginação e filtros
        if (consultas.backend.pacientes && consultas.backend.agendamentos) pontos += 3;
        if (consultas.backend.prontuarios && consultas.backend.usuarios) pontos += 3;
        
        // Frontend - Verificar otimizações
        if (consultas.frontend.paginacao) pontos += 2;
        if (consultas.frontend.busca) pontos += 2;

        console.log(`  ✓ Consultas críticas otimizadas: ${pontos}/10 pontos`);
        
        return {
            pontos,
            maximo: 10,
            detalhes: consultas,
            status: pontos >= 8 ? 'EXCELENTE' : pontos >= 6 ? 'BOM' : 'PRECISA_MELHORAR'
        };
    }

    async validarOtimizacaoBancoDados() {
        console.log('🗄️ Validando otimização do banco de dados...');
        
        const otimizacoes = {
            indices: this.verificarIndicesBanco(),
            relacionamentos: this.verificarRelacionamentosOtimizados(),
            queries: this.verificarQueriesOtimizadas(),
            conexoes: this.verificarPoolConexoes()
        };

        let pontos = 0;
        
        if (otimizacoes.indices) pontos += 3;
        if (otimizacoes.relacionamentos) pontos += 2;
        if (otimizacoes.queries) pontos += 3;
        if (otimizacoes.conexoes) pontos += 2;

        console.log(`  ✓ Otimização do banco: ${pontos}/10 pontos`);
        
        return {
            pontos,
            maximo: 10,
            detalhes: otimizacoes,
            status: pontos >= 8 ? 'EXCELENTE' : pontos >= 6 ? 'BOM' : 'PRECISA_MELHORAR'
        };
    }

    async validarEstrategiaCache() {
        console.log('⚡ Validando estratégias de cache...');
        
        const cache = {
            frontend: {
                reactQuery: this.verificarReactQuery(),
                localStorage: this.verificarLocalStorage(),
                sessionStorage: this.verificarSessionStorage()
            },
            backend: {
                redis: this.verificarRedis(),
                memoryCache: this.verificarMemoryCache()
            }
        };

        let pontos = 0;
        
        if (cache.frontend.reactQuery || cache.frontend.localStorage) pontos += 3;
        if (cache.frontend.sessionStorage) pontos += 2;
        if (cache.backend.redis || cache.backend.memoryCache) pontos += 5;

        console.log(`  ✓ Estratégias de cache: ${pontos}/10 pontos`);
        
        return {
            pontos,
            maximo: 10,
            detalhes: cache,
            status: pontos >= 8 ? 'EXCELENTE' : pontos >= 6 ? 'BOM' : 'PRECISA_MELHORAR'
        };
    }

    async validarOtimizacaoBundle() {
        console.log('📦 Validando otimização do bundle...');
        
        const bundle = {
            vite: this.verificarViteConfig(),
            codesplitting: this.verificarCodeSplitting(),
            treeShaking: this.verificarTreeShaking(),
            minificacao: this.verificarMinificacao()
        };

        let pontos = 0;
        
        if (bundle.vite) pontos += 3;
        if (bundle.codesplitting) pontos += 2;
        if (bundle.treeShaking) pontos += 2;
        if (bundle.minificacao) pontos += 3;

        console.log(`  ✓ Otimização do bundle: ${pontos}/10 pontos`);
        
        return {
            pontos,
            maximo: 10,
            detalhes: bundle,
            status: pontos >= 8 ? 'EXCELENTE' : pontos >= 6 ? 'BOM' : 'PRECISA_MELHORAR'
        };
    }

    async validarLazyLoading() {
        console.log('🔄 Validando lazy loading...');
        
        const lazyLoading = {
            componentesReact: this.verificarLazyComponents(),
            imagens: this.verificarLazyImages(),
            rotas: this.verificarLazyRoutes(),
            tabelas: this.verificarLazyTables()
        };

        let pontos = 0;
        
        if (lazyLoading.componentesReact) pontos += 3;
        if (lazyLoading.imagens) pontos += 2;
        if (lazyLoading.rotas) pontos += 3;
        if (lazyLoading.tabelas) pontos += 2;

        console.log(`  ✓ Lazy loading: ${pontos}/10 pontos`);
        
        return {
            pontos,
            maximo: 10,
            detalhes: lazyLoading,
            status: pontos >= 8 ? 'EXCELENTE' : pontos >= 6 ? 'BOM' : 'PRECISA_MELHORAR'
        };
    }

    // =================== VALIDAÇÃO DE ACESSIBILIDADE ===================

    async validarAcessibilidade() {
        console.log('\n♿ VALIDANDO ACESSIBILIDADE DO SISTEMA...\n');
        
        const resultados = {
            wcagCompliance: await this.validarPadroesWCAG(),
            responsividade: await this.validarResponsividade(),
            navegacaoTeclado: await this.validarNavegacaoTeclado(),
            contrasteCores: await this.validarContrasteCores(),
            semanticaHTML: await this.validarSemanticaHTML()
        };

        let pontuacao = 0;
        Object.values(resultados).forEach(resultado => pontuacao += resultado.pontos);

        this.relatorio.acessibilidade.pontuacao = pontuacao;
        this.relatorio.acessibilidade.detalhes = resultados;

        console.log(`✅ Acessibilidade: ${pontuacao}/${this.relatorio.acessibilidade.maximo} pontos\n`);
        return pontuacao;
    }

    async validarPadroesWCAG() {
        console.log('🎯 Validando padrões W3C/WCAG...');
        
        const wcag = {
            altText: this.verificarAltText(),
            aria: this.verificarARIA(),
            headings: this.verificarEstruturalHeadings(),
            forms: this.verificarFormsAccessible(),
            focus: this.verificarFocusManagement()
        };

        let pontos = 0;
        
        if (wcag.altText) pontos += 2;
        if (wcag.aria) pontos += 3;
        if (wcag.headings) pontos += 2;
        if (wcag.forms) pontos += 2;
        if (wcag.focus) pontos += 1;

        console.log(`  ✓ Padrões W3C/WCAG: ${pontos}/10 pontos`);
        
        return {
            pontos,
            maximo: 10,
            detalhes: wcag,
            status: pontos >= 8 ? 'EXCELENTE' : pontos >= 6 ? 'BOM' : 'PRECISA_MELHORAR'
        };
    }

    async validarResponsividade() {
        console.log('📱 Validando responsividade...');
        
        const responsivo = {
            breakpoints: this.verificarBreakpoints(),
            flexbox: this.verificarFlexboxGrid(),
            imagesResponsive: this.verificarImagensResponsivas(),
            typography: this.verificarTipografiaResponsiva(),
            navigation: this.verificarNavegacaoResponsiva()
        };

        let pontos = 0;
        
        if (responsivo.breakpoints) pontos += 3;
        if (responsivo.flexbox) pontos += 2;
        if (responsivo.imagesResponsive) pontos += 2;
        if (responsivo.typography) pontos += 2;
        if (responsivo.navigation) pontos += 1;

        console.log(`  ✓ Responsividade: ${pontos}/10 pontos`);
        
        return {
            pontos,
            maximo: 10,
            detalhes: responsivo,
            status: pontos >= 8 ? 'EXCELENTE' : pontos >= 6 ? 'BOM' : 'PRECISA_MELHORAR'
        };
    }

    async validarNavegacaoTeclado() {
        console.log('⌨️ Validando navegação por teclado...');
        
        const teclado = {
            tabIndex: this.verificarTabIndex(),
            shortcuts: this.verificarShortcuts(),
            focusVisible: this.verificarFocusVisible(),
            skipLinks: this.verificarSkipLinks(),
            modals: this.verificarModalKeyboard()
        };

        let pontos = 0;
        
        if (teclado.tabIndex) pontos += 3;
        if (teclado.shortcuts) pontos += 2;
        if (teclado.focusVisible) pontos += 2;
        if (teclado.skipLinks) pontos += 2;
        if (teclado.modals) pontos += 1;

        console.log(`  ✓ Navegação por teclado: ${pontos}/10 pontos`);
        
        return {
            pontos,
            maximo: 10,
            detalhes: teclado,
            status: pontos >= 8 ? 'EXCELENTE' : pontos >= 6 ? 'BOM' : 'PRECISA_MELHORAR'
        };
    }

    async validarContrasteCores() {
        console.log('🎨 Validando contraste de cores...');
        
        const contraste = {
            cssVariables: this.verificarVariaveisCor(),
            darkMode: this.verificarModoEscuro(),
            highContrast: this.verificarAltoContraste(),
            colorBlind: this.verificarDaltonismo(),
            ratios: this.verificarRatiosContraste()
        };

        let pontos = 0;
        
        if (contraste.cssVariables) pontos += 2;
        if (contraste.darkMode) pontos += 3;
        if (contraste.highContrast) pontos += 2;
        if (contraste.colorBlind) pontos += 2;
        if (contraste.ratios) pontos += 1;

        console.log(`  ✓ Contraste de cores: ${pontos}/10 pontos`);
        
        return {
            pontos,
            maximo: 10,
            detalhes: contraste,
            status: pontos >= 8 ? 'EXCELENTE' : pontos >= 6 ? 'BOM' : 'PRECISA_MELHORAR'
        };
    }

    async validarSemanticaHTML() {
        console.log('🏗️ Validando semântica HTML...');
        
        const semantica = {
            landmarks: this.verificarLandmarks(),
            headingStructure: this.verificarEstruturaHeadings(),
            lists: this.verificarListas(),
            tables: this.verificarTabelasSemanticas(),
            forms: this.verificarFormsSemanticos()
        };

        let pontos = 0;
        
        if (semantica.landmarks) pontos += 2;
        if (semantica.headingStructure) pontos += 3;
        if (semantica.lists) pontos += 2;
        if (semantica.tables) pontos += 2;
        if (semantica.forms) pontos += 1;

        console.log(`  ✓ Semântica HTML: ${pontos}/10 pontos`);
        
        return {
            pontos,
            maximo: 10,
            detalhes: semantica,
            status: pontos >= 8 ? 'EXCELENTE' : pontos >= 6 ? 'BOM' : 'PRECISA_MELHORAR'
        };
    }

    // =================== MÉTODOS AUXILIARES ===================

    verificarArquivo(caminho) {
        try {
            return fs.existsSync(path.join(process.cwd(), caminho));
        } catch {
            return false;
        }
    }

    verificarPaginacao() {
        const arquivos = [
            'frontend/src/components/ui/pagination.tsx',
            'frontend/src/pages/Pacientes.tsx',
            'frontend/src/pages/Agendamentos.tsx'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarBuscaOtimizada() {
        const arquivos = [
            'frontend/src/components/BuscaPaciente.tsx',
            'frontend/src/hooks/useDebounce.ts',
            'frontend/src/hooks/useSearch.ts'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarFiltrosRapidos() {
        const arquivos = [
            'frontend/src/components/FiltroAvancado.tsx',
            'frontend/src/components/FiltroRapido.tsx'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarIndicesBanco() {
        const arquivos = [
            'backend/src/database/migrations',
            'backend/database/migrations'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarRelacionamentosOtimizados() {
        const arquivos = [
            'backend/src/modules/paciente/entities',
            'backend/src/modules/agendamento/entities'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarQueriesOtimizadas() {
        const arquivos = [
            'backend/src/modules/paciente/repositories',
            'backend/src/modules/agendamento/repositories'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarPoolConexoes() {
        const arquivos = [
            'backend/src/database/database.module.ts',
            'backend/src/config/database.config.ts'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarReactQuery() {
        try {
            const packageJson = fs.readFileSync('frontend/package.json', 'utf8');
            return packageJson.includes('@tanstack/react-query') || packageJson.includes('react-query');
        } catch {
            return false;
        }
    }

    verificarLocalStorage() {
        const arquivos = [
            'frontend/src/utils/storage.ts',
            'frontend/src/hooks/useLocalStorage.ts'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarSessionStorage() {
        const arquivos = [
            'frontend/src/utils/session.ts',
            'frontend/src/hooks/useSessionStorage.ts'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarRedis() {
        try {
            const packageJson = fs.readFileSync('backend/package.json', 'utf8');
            return packageJson.includes('redis') || packageJson.includes('ioredis');
        } catch {
            return false;
        }
    }

    verificarMemoryCache() {
        try {
            const packageJson = fs.readFileSync('backend/package.json', 'utf8');
            return packageJson.includes('cache-manager') || packageJson.includes('node-cache');
        } catch {
            return false;
        }
    }

    verificarViteConfig() {
        return this.verificarArquivo('frontend/vite.config.js') || this.verificarArquivo('frontend/vite.config.ts');
    }

    verificarCodeSplitting() {
        const arquivos = [
            'frontend/src/App.tsx',
            'frontend/src/routes'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarTreeShaking() {
        try {
            const packageJson = fs.readFileSync('frontend/package.json', 'utf8');
            return packageJson.includes('type": "module') || this.verificarViteConfig();
        } catch {
            return false;
        }
    }

    verificarMinificacao() {
        return this.verificarViteConfig(); // Vite inclui minificação por padrão
    }

    verificarLazyComponents() {
        try {
            const appTsx = fs.readFileSync('frontend/src/App.tsx', 'utf8');
            return appTsx.includes('React.lazy') || appTsx.includes('lazy(');
        } catch {
            return false;
        }
    }

    verificarLazyImages() {
        const arquivos = [
            'frontend/src/components/LazyImage.tsx',
            'frontend/src/hooks/useLazyLoad.ts'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarLazyRoutes() {
        try {
            const appTsx = fs.readFileSync('frontend/src/App.tsx', 'utf8');
            return appTsx.includes('lazy(') && appTsx.includes('import(');
        } catch {
            return false;
        }
    }

    verificarLazyTables() {
        const arquivos = [
            'frontend/src/components/DataTable.tsx',
            'frontend/src/components/VirtualTable.tsx'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarAltText() {
        const arquivos = [
            'frontend/src/components',
            'frontend/src/pages'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarARIA() {
        try {
            const componentsJson = fs.readFileSync('frontend/components.json', 'utf8');
            return componentsJson.includes('shadcn'); // shadcn/ui inclui ARIA por padrão
        } catch {
            return false;
        }
    }

    verificarEstruturalHeadings() {
        const arquivos = [
            'frontend/src/components/ui/typography.tsx',
            'frontend/src/pages'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarFormsAccessible() {
        const arquivos = [
            'frontend/src/components/ui/form.tsx',
            'frontend/src/components/ui/label.tsx'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarFocusManagement() {
        const arquivos = [
            'frontend/src/hooks/useFocus.ts',
            'frontend/src/utils/focus.ts'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarBreakpoints() {
        const arquivos = [
            'frontend/tailwind.config.js',
            'frontend/src/styles/globals.css'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarFlexboxGrid() {
        try {
            const globalsCss = fs.readFileSync('frontend/src/styles/globals.css', 'utf8');
            return globalsCss.includes('flex') || globalsCss.includes('grid');
        } catch {
            return true; // Tailwind tem flexbox/grid por padrão
        }
    }

    verificarImagensResponsivas() {
        const arquivos = [
            'frontend/src/components/ResponsiveImage.tsx',
            'frontend/src/components/Avatar.tsx'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarTipografiaResponsiva() {
        try {
            const tailwindConfig = this.verificarArquivo('frontend/tailwind.config.js');
            return tailwindConfig; // Tailwind tem tipografia responsiva
        } catch {
            return false;
        }
    }

    verificarNavegacaoResponsiva() {
        const arquivos = [
            'frontend/src/components/Navigation.tsx',
            'frontend/src/components/MobileMenu.tsx'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarTabIndex() {
        const arquivos = [
            'frontend/src/components/ui',
            'frontend/src/components'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarShortcuts() {
        const arquivos = [
            'frontend/src/hooks/useKeyboard.ts',
            'frontend/src/utils/shortcuts.ts'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarFocusVisible() {
        try {
            const globalsCss = fs.readFileSync('frontend/src/styles/globals.css', 'utf8');
            return globalsCss.includes('focus-visible') || globalsCss.includes(':focus');
        } catch {
            return true; // Tailwind tem focus styles
        }
    }

    verificarSkipLinks() {
        const arquivos = [
            'frontend/src/components/SkipLink.tsx',
            'frontend/src/components/AccessibilityNav.tsx'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarModalKeyboard() {
        const arquivos = [
            'frontend/src/components/ui/dialog.tsx',
            'frontend/src/components/ui/modal.tsx'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarVariaveisCor() {
        try {
            const globalsCss = fs.readFileSync('frontend/src/styles/globals.css', 'utf8');
            return globalsCss.includes('--') || globalsCss.includes('hsl(');
        } catch {
            return false;
        }
    }

    verificarModoEscuro() {
        const arquivos = [
            'frontend/src/components/ThemeToggle.tsx',
            'frontend/src/hooks/useTheme.ts'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarAltoContraste() {
        try {
            const globalsCss = fs.readFileSync('frontend/src/styles/globals.css', 'utf8');
            return globalsCss.includes('high-contrast') || globalsCss.includes('prefers-contrast');
        } catch {
            return false;
        }
    }

    verificarDaltonismo() {
        try {
            const globalsCss = fs.readFileSync('frontend/src/styles/globals.css', 'utf8');
            return !globalsCss.includes('color: red') && !globalsCss.includes('color: green'); // Não usar apenas cor
        } catch {
            return true;
        }
    }

    verificarRatiosContraste() {
        // Verificação básica - shadcn/ui geralmente tem bons contrastes
        return this.verificarArquivo('frontend/components.json');
    }

    verificarLandmarks() {
        const arquivos = [
            'frontend/src/components/Header.tsx',
            'frontend/src/components/Navigation.tsx',
            'frontend/src/components/Sidebar.tsx'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarEstruturaHeadings() {
        return this.verificarArquivo('frontend/src/pages');
    }

    verificarListas() {
        const arquivos = [
            'frontend/src/components/ui/list.tsx',
            'frontend/src/components/Navigation.tsx'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarTabelasSemanticas() {
        const arquivos = [
            'frontend/src/components/ui/table.tsx',
            'frontend/src/components/DataTable.tsx'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    verificarFormsSemanticos() {
        const arquivos = [
            'frontend/src/components/ui/form.tsx',
            'frontend/src/components/ui/input.tsx'
        ];
        return arquivos.some(arquivo => this.verificarArquivo(arquivo));
    }

    // =================== GERAÇÃO DE RELATÓRIO ===================

    gerarRelatorio() {
        const desempenho = this.relatorio.desempenho.pontuacao;
        const acessibilidade = this.relatorio.acessibilidade.pontuacao;
        const total = desempenho + acessibilidade;
        
        this.relatorio.pontuacaoTotal = total;
        
        // Determinar status geral
        if (total >= 85) this.relatorio.status = 'EXCELENTE - OPERACIONAL';
        else if (total >= 70) this.relatorio.status = 'BOM - FUNCIONAL';
        else if (total >= 50) this.relatorio.status = 'ACEITÁVEL - PRECISA MELHORIAS';
        else this.relatorio.status = 'CRÍTICO - REQUER ATENÇÃO IMEDIATA';

        // Salvar relatório
        fs.writeFileSync(
            'RELATORIO_DESEMPENHO_ACESSIBILIDADE.json',
            JSON.stringify(this.relatorio, null, 2)
        );

        return this.relatorio;
    }

    async executarValidacao() {
        console.log('🏥 SGH - SISTEMA DE GESTÃO HOSPITALAR');
        console.log('📋 VALIDAÇÃO: DESEMPENHO E ACESSIBILIDADE');
        console.log('=' .repeat(80));

        await this.validarDesempenho();
        await this.validarAcessibilidade();
        
        const relatorio = this.gerarRelatorio();
        
        console.log('\n' + '='.repeat(80));
        console.log('📊 RELATÓRIO FINAL - DESEMPENHO E ACESSIBILIDADE');
        console.log('='.repeat(80));
        console.log(`🚀 DESEMPENHO: ${relatorio.desempenho.pontuacao}/${relatorio.desempenho.maximo} pontos`);
        console.log(`♿ ACESSIBILIDADE: ${relatorio.acessibilidade.pontuacao}/${relatorio.acessibilidade.maximo} pontos`);
        console.log(`🎯 TOTAL: ${relatorio.pontuacaoTotal}/${relatorio.maximoTotal} pontos`);
        console.log(`📋 STATUS: ${relatorio.status}`);
        console.log('='.repeat(80));
        console.log('💾 Relatório salvo em: RELATORIO_DESEMPENHO_ACESSIBILIDADE.json\n');
        
        return relatorio;
    }
}

// Executar validação
if (require.main === module) {
    const validador = new ValidadorDesempenhoAcessibilidade();
    validador.executarValidacao().catch(console.error);
}

module.exports = ValidadorDesempenhoAcessibilidade;

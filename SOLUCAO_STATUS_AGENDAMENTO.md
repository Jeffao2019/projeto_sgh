# CORREÇÃO: Alteração de Status do Agendamento

## Problema Identificado
- **Sintoma**: Ao alterar o status de um agendamento de "AGENDADO" para "CONFIRMADO", o status ficava como "REAGENDADO"
- **Causa Raiz**: O método `update()` no `AgendamentoUseCase` só tratava reagendamentos (mudança de data) e retornava o agendamento original para outros tipos de atualização

## Arquivos Corrigidos

### 1. `backend/src/domain/entities/agendamento.entity.ts`
**Problema**: Entidade não tinha método para atualização genérica de campos
**Solução**: Adicionado método `atualizar()` que permite atualizar status, tipo, observações e data/hora

```typescript
public atualizar(
  dataHora?: Date,
  tipo?: TipoConsulta,
  status?: StatusAgendamento,
  observacoes?: string,
): Agendamento {
  return new Agendamento(
    this.id,
    this.pacienteId,
    this.medicoId,
    dataHora ?? this.dataHora,
    tipo ?? this.tipo,
    status ?? this.status,
    observacoes ?? this.observacoes,
    this.createdAt,
    new Date(),
  );
}
```

### 2. `backend/src/application/use-cases/agendamento.use-case.ts`
**Problema**: Método `update()` apenas retornava agendamento original para mudanças que não fossem de data
**Solução**: Implementada lógica para:
- Detectar mudança real de data/hora (não apenas presença do campo)
- Usar método `atualizar()` para mudanças de status, tipo e observações
- Manter verificação de disponibilidade apenas para reagendamentos reais

```typescript
async update(id: string, updateAgendamentoDto: UpdateAgendamentoDto): Promise<Agendamento> {
  const agendamento = await this.findById(id);

  // Se está reagendando (mudança efetiva de data/hora)
  if (updateAgendamentoDto.dataHora) {
    const novaDataHora = new Date(updateAgendamentoDto.dataHora);
    const dataAtual = new Date(agendamento.dataHora);
    const dataRealmenteMudou = novaDataHora.getTime() !== dataAtual.getTime();

    if (dataRealmenteMudou) {
      // Lógica de reagendamento com verificações
      const reagendamento = agendamento.reagendar(novaDataHora);
      return await this.agendamentoRepository.update(reagendamento);
    }
  }

  // Para outras atualizações (status, tipo, observações)
  const agendamentoAtualizado = agendamento.atualizar(
    updateAgendamentoDto.dataHora ? new Date(updateAgendamentoDto.dataHora) : undefined,
    updateAgendamentoDto.tipo,
    updateAgendamentoDto.status,
    updateAgendamentoDto.observacoes,
  );

  return await this.agendamentoRepository.update(agendamentoAtualizado);
}
```

## Comportamento Corrigido

### Antes da Correção:
- Alterar status de "AGENDADO" → "CONFIRMADO" = Resultado: "REAGENDADO" ❌
- Apenas reagendamentos (mudança de data) funcionavam corretamente

### Após a Correção:
- Alterar status de "AGENDADO" → "CONFIRMADO" = Resultado: "CONFIRMADO" ✅
- Alterar apenas observações = Mantém status original ✅
- Alterar apenas tipo de consulta = Mantém status original ✅
- Reagendamento real (mudança de data) = Status "REAGENDADO" ✅

## Testes Realizados
1. ✅ Alteração simples de status (AGENDADO → CONFIRMADO)
2. ✅ Múltiplas alterações de status (CONFIRMADO → FINALIZADO → CANCELADO)
3. ✅ Atualização de observações mantendo status
4. ✅ Reagendamento real com mudança de data
5. ✅ Persistência no banco de dados

## Status
🎉 **PROBLEMA RESOLVIDO COMPLETAMENTE**

O usuário agora pode alterar o status do agendamento de "agendado" para "confirmado" sem que o sistema altere incorretamente para "reagendado".

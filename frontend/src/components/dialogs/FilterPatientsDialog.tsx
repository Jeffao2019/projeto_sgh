import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterPatientsDialogProps {
  filters: {
    nome: string;
    cpf: string;
    convenio: string;
  };
  onFilterChange: (filters: any) => void;
  onClearFilters: () => void;
  onOpenChange?: () => boolean;
}

export function FilterPatientsDialog({
  filters,
  onFilterChange,
  onClearFilters,
  onOpenChange,
}: FilterPatientsDialogProps) {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      if (onOpenChange?.() === false) {
        return;
      }
      setLocalFilters(filters);
    }
    setOpen(newOpen);
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    setOpen(false);
  };

  const handleClear = () => {
    onClearFilters();
    setLocalFilters({ nome: "", cpf: "", convenio: "" });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button variant="outline" onClick={() => handleOpenChange(true)}>
        Filtros
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtrar Pacientes</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={localFilters.nome}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, nome: e.target.value })
              }
              placeholder="Filtrar por nome..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={localFilters.cpf}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, cpf: e.target.value })
              }
              placeholder="Filtrar por CPF..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="convenio">Convênio</Label>
            <Select
              value={localFilters.convenio}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, convenio: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um convênio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="PARTICULAR">Particular</SelectItem>
                <SelectItem value="UNIMED">Unimed</SelectItem>
                <SelectItem value="AMIL">Amil</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClear}>
            Limpar Filtros
          </Button>
          <Button onClick={handleApply}>Aplicar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminLayout from "@/components/admin/AdminLayout";
import { Currency } from "@shared/schema";
import { toast } from "@/hooks/use-toast";

export default function CurrenciesPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [symbol, setSymbol] = useState("");
  const [points, setPoints] = useState("");
  const [amount, setAmount] = useState("");

  const { data: currencies = [] } = useQuery<Currency[]>({
    queryKey: ['/api/admin/currencies'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch('/api/admin/currencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('Failed to create currency');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/currencies'] });
      setName("");
      setCode("");
      setSymbol("");
      setPoints("");
      setAmount("");
      toast({ title: "Currency created successfully" });
    },
    onError: (error) => {
      toast({ 
        title: "Failed to create currency", 
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/currencies/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete currency');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/currencies'] });
      toast({ title: "Currency deleted successfully" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !symbol || !points || !amount) {
      toast({ 
        title: "All fields are required",
        variant: "destructive"
      });
      return;
    }

    const exchangeRate = Math.round((parseInt(points) / parseFloat(amount)));
    createMutation.mutate({
      name,
      code,
      symbol,
      exchangeRate
    });
  };

  return (
    <AdminLayout>
      <div className="container py-6">
        <h1 className="text-2xl font-bold mb-6">Currencies</h1>

        <form onSubmit={handleSubmit} className="grid gap-4 max-w-md mb-8">
          <Input
            placeholder="Currency Name (e.g. US Dollar)"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <Input
            placeholder="Currency Code (e.g. USD)"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <Input
            placeholder="Symbol (e.g. $)"
            value={symbol}
            onChange={e => setSymbol(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Points Amount"
              value={points}
              onChange={e => setPoints(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Currency Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
          {points && amount && (
            <div className="text-sm text-gray-600">
              Exchange Rate: {Math.round((parseInt(points) / parseFloat(amount)))} points per {code || 'currency unit'}
            </div>
          )}
          <Button type="submit">Add Currency</Button>
        </form>

        <div className="grid gap-4">
          {currencies.map(currency => (
            <div key={currency.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
              <div>
                <h3 className="font-semibold">{currency.name}</h3>
                <p className="text-sm text-gray-600">
                  {currency.symbol} ({currency.code}) - {currency.exchangeRate} points per unit
                </p>
              </div>
              <Button 
                variant="destructive"
                onClick={() => deleteMutation.mutate(currency.id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
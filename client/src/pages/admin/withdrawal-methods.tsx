import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Pencil, Trash2, Plus } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { WithdrawalMethod, InsertWithdrawalMethod, Currency } from "@shared/schema";

export default function AdminWithdrawalMethods() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<InsertWithdrawalMethod>>({
    name: "",
    description: "",
    iconUrl: "",
    minAmount: 0,
    maxAmount: 0,
    isActive: true,
    requiredFields: JSON.stringify(["accountNumber"]),
    currencyId: 0
  });
  const { toast } = useToast();

  // Fetch withdrawal methods
  const { data: withdrawalMethods = [], isLoading } = useQuery<WithdrawalMethod[]>({
    queryKey: ['/api/admin/withdrawal-methods'],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch withdrawal methods",
        variant: "destructive",
      });
    }
  });

  // Fetch currencies for the select dropdown
  const { data: currencies = [] } = useQuery<Currency[]>({
    queryKey: ['/api/admin/currencies'],
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to fetch currencies",
        variant: "destructive",
      });
    }
  });

  // Create withdrawal method mutation
  const createMethodMutation = useMutation({
    mutationFn: async (newMethod: InsertWithdrawalMethod) => {
      return apiRequest("POST", "/api/admin/withdrawal-methods", newMethod);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/withdrawal-methods'] });
      toast({
        title: "Success",
        description: "Withdrawal method created successfully",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create withdrawal method",
        variant: "destructive",
      });
    }
  });

  // Update withdrawal method mutation
  const updateMethodMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertWithdrawalMethod> }) => {
      return apiRequest("PATCH", `/api/admin/withdrawal-methods/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/withdrawal-methods'] });
      toast({
        title: "Success",
        description: "Withdrawal method updated successfully",
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update withdrawal method",
        variant: "destructive",
      });
    }
  });

  // Delete withdrawal method mutation
  const deleteMethodMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/withdrawal-methods/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/withdrawal-methods'] });
      toast({
        title: "Success",
        description: "Withdrawal method deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete withdrawal method",
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === "minAmount" || name === "maxAmount") {
        return { ...prev, [name]: parseInt(value) || 0 };
      } else if (name === "currencyId") {
        return { ...prev, [name]: parseInt(value) || 0 };
      } else if (name === "isActive") {
        return { ...prev, [name]: value === "true" };
      } else if (name === "requiredFields") {
        try {
          // Validate JSON
          JSON.parse(value);
          return { ...prev, [name]: value };
        } catch (error) {
          // If not valid JSON, don't update
          return prev;
        }
      } else {
        return { ...prev, [name]: value };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditMode && editId) {
      updateMethodMutation.mutate({ id: editId, data: formData });
    } else {
      createMethodMutation.mutate(formData as InsertWithdrawalMethod);
    }
  };

  const handleEdit = (method: WithdrawalMethod) => {
    setIsEditMode(true);
    setEditId(method.id);
    setFormData({
      name: method.name,
      description: method.description,
      iconUrl: method.iconUrl || "",
      minAmount: method.minAmount,
      maxAmount: method.maxAmount,
      isActive: method.isActive,
      requiredFields: method.requiredFields,
      currencyId: method.currencyId
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this withdrawal method?")) {
      deleteMethodMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      iconUrl: "",
      minAmount: 0,
      maxAmount: 0,
      isActive: true,
      requiredFields: JSON.stringify(["accountNumber"]),
      currencyId: currencies[0]?.id || 0
    });
    setIsEditMode(false);
    setEditId(null);
  };

  const openCreateDialog = () => {
    if (currencies.length === 0) {
      toast({
        title: "Error",
        description: "You need to create a currency first",
        variant: "destructive",
      });
      return;
    }
    resetForm();
    setIsDialogOpen(true);
  };

  // Helper to find currency name by ID
  const getCurrencyName = (currencyId: number) => {
    const currency = currencies.find(c => c.id === currencyId);
    return currency ? currency.name : "Unknown";
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Withdrawal Methods</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Method
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableCaption>List of available withdrawal methods</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>Min Amount</TableHead>
              <TableHead>Max Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {withdrawalMethods.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No withdrawal methods found. Create your first one!
                </TableCell>
              </TableRow>
            ) : (
              withdrawalMethods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell>{method.id}</TableCell>
                  <TableCell>{method.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{method.description}</TableCell>
                  <TableCell>{getCurrencyName(method.currencyId)}</TableCell>
                  <TableCell>{method.minAmount}</TableCell>
                  <TableCell>{method.maxAmount}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${method.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {method.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(method)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDelete(method.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit Withdrawal Method' : 'Create Withdrawal Method'}</DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? 'Edit the withdrawal method details.' 
                : 'Add a new method for users to withdraw their funds.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="PayPal"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Withdraw directly to your PayPal account"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="iconUrl" className="text-right">Icon URL</Label>
                <Input
                  id="iconUrl"
                  name="iconUrl"
                  value={formData.iconUrl}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="https://example.com/paypal-icon.png"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="currencyId" className="text-right">Currency</Label>
                <select
                  id="currencyId"
                  name="currencyId"
                  value={formData.currencyId}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select a currency</option>
                  {currencies.map(currency => (
                    <option key={currency.id} value={currency.id}>
                      {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minAmount" className="text-right">Min Amount</Label>
                <Input
                  id="minAmount"
                  name="minAmount"
                  type="number"
                  value={formData.minAmount}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="5"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxAmount" className="text-right">Max Amount</Label>
                <Input
                  id="maxAmount"
                  name="maxAmount"
                  type="number"
                  value={formData.maxAmount}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="1000"
                  required
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="requiredFields" className="text-right">Required Fields</Label>
                <Textarea
                  id="requiredFields"
                  name="requiredFields"
                  value={formData.requiredFields}
                  onChange={handleInputChange}
                  className="col-span-3 font-mono text-sm"
                  placeholder='["email", "accountNumber"]'
                  required
                />
                <div className="col-span-3 col-start-2 text-xs text-gray-500">
                  JSON array of field names that users need to provide (e.g., ["email", "accountNumber"])
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">Status</Label>
                <select
                  id="isActive"
                  name="isActive"
                  value={formData.isActive ? "true" : "false"}
                  onChange={handleInputChange}
                  className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createMethodMutation.isPending || updateMethodMutation.isPending}
              >
                {(createMethodMutation.isPending || updateMethodMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditMode ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
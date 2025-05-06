import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getAssetById, createAsset, updateAsset } from "@/services/assetService";
import { getDataFields } from "@/services/dataFieldService";
import { DataField } from "@/components/datafields/DataFieldTable";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery } from "@tanstack/react-query";

// Update the form schema to include dynamic custom fields
const createAssetFormSchema = () => {
  const baseSchema = {
    name: z.string().min(2, {
      message: "Asset name must be at least 2 characters.",
    }),
    category: z.string({
      required_error: "Please select a category.",
    }),
    location: z.string().min(2, {
      message: "Location must be at least 2 characters.",
    }),
    status: z.string({
      required_error: "Please select a status.",
    }),
    assignedTo: z.string().optional(),
    purchaseDate: z.string().optional(),
    purchasePrice: z.string().optional(),
    notes: z.string().optional(),
    customFields: z.record(z.any()).optional(),
  };

  return z.object(baseSchema);
};

type AssetFormValues = z.infer<ReturnType<typeof createAssetFormSchema>>;

const AssetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!id;
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch custom data fields
  const { data: dataFields = [] } = useQuery({
    queryKey: ['dataFields'],
    queryFn: getDataFields,
  });
  
  // Mock data for dropdowns
  const categories = ["Electronics", "Furniture", "Office Equipment", "IT Hardware", "Software Licenses"];
  const statuses = ["In Use", "In Storage", "Under Repair", "Disposed"];

  // Form state
  const form = useForm<AssetFormValues>({
    resolver: zodResolver(createAssetFormSchema()),
    defaultValues: {
      name: "",
      category: "",
      location: "",
      status: "In Use",
      assignedTo: "",
      purchaseDate: "",
      purchasePrice: "",
      notes: "",
      customFields: {},
    },
  });

  // Load asset data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const asset = getAssetById(id);
      if (asset) {
        form.reset({
          name: asset.name,
          category: asset.category,
          location: asset.location,
          status: asset.status,
          assignedTo: asset.assignedTo || "",
          purchaseDate: asset.purchaseDate || "",
          purchasePrice: asset.purchasePrice || "",
          notes: asset.notes || "",
          customFields: asset.customFields || {},
        });
      } else {
        toast({
          title: "Asset Not Found",
          description: "The requested asset could not be found.",
          variant: "destructive",
        });
        navigate("/assets");
      }
    }
  }, [id, isEditMode, form, navigate, toast]);

  // Submit handler
  const onSubmit = (data: AssetFormValues) => {
    setIsLoading(true);
    
    try {
      if (isEditMode && id) {
        // Update existing asset
        updateAsset({
          id,
          name: data.name,
          category: data.category,
          location: data.location,
          status: data.status,
          assignedTo: data.assignedTo,
          purchaseDate: data.purchaseDate,
          purchasePrice: data.purchasePrice,
          notes: data.notes,
          customFields: data.customFields,
        });
        toast({
          title: "Asset Updated",
          description: `Successfully updated ${data.name}`,
        });
      } else {
        // Create new asset
        createAsset({
          name: data.name,
          category: data.category,
          location: data.location,
          status: data.status,
          assignedTo: data.assignedTo,
          purchaseDate: data.purchaseDate,
          purchasePrice: data.purchasePrice,
          notes: data.notes,
          customFields: data.customFields,
        });
        toast({
          title: "Asset Created",
          description: `Successfully created ${data.name}`,
        });
      }
      navigate("/assets");
    } catch (error) {
      console.error("Error saving asset:", error);
      toast({
        title: "Error",
        description: "Failed to save asset. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render custom field based on its type
  const renderCustomField = (field: DataField) => {
    const fieldValue = form.watch(`customFields.${field.name}`);
    
    switch (field.type) {
      case "text":
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={`customFields.${field.name}`}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label} {field.required && <span className="text-destructive">*</span>}</FormLabel>
                <FormControl>
                  <Input {...formField} placeholder={`Enter ${field.label.toLowerCase()}`} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case "number":
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={`customFields.${field.name}`}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label} {field.required && <span className="text-destructive">*</span>}</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    {...formField} 
                    value={formField.value || ''} 
                    onChange={(e) => formField.onChange(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder={`Enter ${field.label.toLowerCase()}`} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case "date":
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={`customFields.${field.name}`}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label} {field.required && <span className="text-destructive">*</span>}</FormLabel>
                <FormControl>
                  <Input type="date" {...formField} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case "select":
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={`customFields.${field.name}`}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label} {field.required && <span className="text-destructive">*</span>}</FormLabel>
                <Select 
                  onValueChange={formField.onChange} 
                  defaultValue={formField.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        );
        
      case "checkbox":
        return (
          <FormField
            key={field.id}
            control={form.control}
            name={`customFields.${field.name}`}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={formField.value}
                    onCheckedChange={formField.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    {field.label} {field.required && <span className="text-destructive">*</span>}
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="animate-fade-in">
        <div className="mb-8 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-4"
            onClick={() => navigate("/assets")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assets
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditMode ? "Edit Asset" : "New Asset"}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode 
                ? "Update the details of an existing asset" 
                : "Create a new asset in your inventory"
              }
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic asset information */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asset Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter asset name" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name or description of the asset.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter asset location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <FormControl>
                      <Input placeholder="Person or department" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="purchaseDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="purchasePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Price</FormLabel>
                      <FormControl>
                        <Input placeholder="$0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Custom Fields Section */}
              {dataFields.length > 0 && (
                <div className="space-y-6">
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-medium mb-4">Custom Fields</h3>
                    <div className="space-y-4">
                      {dataFields.map(renderCustomField)}
                    </div>
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional details about the asset..."
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/assets")}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  <Save className="mr-2 h-4 w-4" />
                  {isEditMode ? "Update Asset" : "Create Asset"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </MainLayout>
  );
};

export default AssetForm;

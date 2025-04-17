
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { DataField } from "./DataFieldTable";
import { PlusCircle, X } from "lucide-react";

interface DataFieldFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<DataField, "id">) => void;
  defaultValues?: DataField;
  title: string;
}

const DataFieldForm: React.FC<DataFieldFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  title,
}) => {
  const [fieldType, setFieldType] = useState<string>(defaultValues?.type || "text");
  const [options, setOptions] = useState<string[]>(defaultValues?.options || []);
  const [newOption, setNewOption] = useState("");

  const form = useForm<Omit<DataField, "id">>({
    defaultValues: {
      name: defaultValues?.name || "",
      label: defaultValues?.label || "",
      type: defaultValues?.type || "text",
      required: defaultValues?.required || false,
      options: defaultValues?.options || [],
      defaultValue: defaultValues?.defaultValue || "",
    },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        name: defaultValues.name,
        label: defaultValues.label,
        type: defaultValues.type,
        required: defaultValues.required,
        options: defaultValues.options,
        defaultValue: defaultValues.defaultValue,
      });
      setFieldType(defaultValues.type);
      setOptions(defaultValues.options || []);
    } else {
      form.reset({
        name: "",
        label: "",
        type: "text",
        required: false,
        options: [],
        defaultValue: "",
      });
      setFieldType("text");
      setOptions([]);
    }
  }, [defaultValues, form, isOpen]);

  const handleAddOption = () => {
    if (newOption.trim() !== "" && !options.includes(newOption.trim())) {
      const updatedOptions = [...options, newOption.trim()];
      setOptions(updatedOptions);
      form.setValue("options", updatedOptions);
      setNewOption("");
    }
  };

  const handleRemoveOption = (option: string) => {
    const updatedOptions = options.filter((opt) => opt !== option);
    setOptions(updatedOptions);
    form.setValue("options", updatedOptions);
  };

  const handleTypeChange = (value: string) => {
    setFieldType(value);
    form.setValue("type", value as any);
    
    // Reset options if not select type
    if (value !== "select") {
      setOptions([]);
      form.setValue("options", []);
    }
    
    // Reset default value based on type
    if (value === "text") form.setValue("defaultValue", "");
    if (value === "number") form.setValue("defaultValue", 0);
    if (value === "date") form.setValue("defaultValue", "");
    if (value === "select") form.setValue("defaultValue", "");
    if (value === "checkbox") form.setValue("defaultValue", false);
  };

  const handleSubmit = (data: Omit<DataField, "id">) => {
    // Ensure options are included if type is select
    if (data.type === "select" && (!data.options || data.options.length === 0)) {
      form.setError("options", {
        type: "manual",
        message: "Please add at least one option for select type",
      });
      return;
    }

    // Clean up options for non-select types
    if (data.type !== "select") {
      data.options = undefined;
    }

    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="field_name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Used as the field identifier (no spaces, lowercase)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Label</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Field Label" 
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Label shown to users in forms
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Field Type</FormLabel>
                  <Select
                    onValueChange={(value) => handleTypeChange(value)}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                      <SelectItem value="select">Select (Dropdown)</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Required Field</FormLabel>
                    <FormDescription>
                      Make this field mandatory for users
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {fieldType === "select" && (
              <div className="space-y-2">
                <FormLabel>Options</FormLabel>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add option"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                  />
                  <Button 
                    type="button" 
                    onClick={handleAddOption}
                    variant="outline"
                    size="icon"
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
                {options.length === 0 && (
                  <div className="text-sm text-destructive">
                    Please add at least one option
                  </div>
                )}
                <div className="mt-2">
                  {options.map((option, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between bg-muted px-3 py-2 rounded-md mb-1"
                    >
                      <span>{option}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(option)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {fieldType === "text" && (
              <FormField
                control={form.control}
                name="defaultValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Value (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Default text" 
                        {...field} 
                        value={field.value as string || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {fieldType === "number" && (
              <FormField
                control={form.control}
                name="defaultValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Value (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        placeholder="0" 
                        {...field} 
                        value={field.value as number || 0}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save Field</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DataFieldForm;

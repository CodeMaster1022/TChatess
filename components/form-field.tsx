import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false
}) => {
  return (
    <div className="space-y-2">
      <Label 
        htmlFor={id} 
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="h-12 bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500 dark:bg-slate-800/50 dark:border-gray-600 transition-all duration-200 hover:shadow-md"
      />
    </div>
  );
};

export default FormField;
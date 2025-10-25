"use client"

import { createContext, useContext, useState } from "react"
import { useRouter } from "next/navigation"

interface ProductVariantForm {
  id: string
  name: string
  price: number
  description?: string
}

interface DownloadFileForm {
  id: string
  name: string
  url: string
  type: string
  size?: string
}

interface ProductFormContextType {
  currentStep: number
  setCurrentStep: (step: number) => void
  formData: any
  handleInputChange: (field: string, value: any) => void
  handleArrayChange: (field: string, index: number, value: string) => void
  addArrayItem: (field: string) => void
  removeArrayItem: (field: string, index: number) => void
  addVariant: () => void
  updateVariant: (variantId: string, field: string, value: any) => void
  removeVariant: (variantId: string) => void
  addFile: () => void
  updateFile: (fileId: string, field: string, value: any) => void
  removeFile: (fileId: string) => void
  handleSubmit: () => void
}

const ProductFormContext = createContext<ProductFormContextType | undefined>(undefined)

export function ProductFormProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    price: 0,
    currency: "USD",
    category: "",
    type: "digital",
    isPublished: false,
    tags: [] as string[],
    features: [""],
    requirements: [""],
    variants: [] as ProductVariantForm[],
    files: [] as DownloadFileForm[],
    licenseTerms: "",
    isRecurring: false,
    recurringInterval: "month",
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

const handleArrayChange = (field: string, index: number, value: string) => {
  setFormData((prev) => {
    const fieldValue = prev[field as keyof typeof prev];

    // Only allow array fields
    if (Array.isArray(fieldValue)) {
      return {
        ...prev,
        [field]: (fieldValue as string[]).map((item, i) => (i === index ? value : item)),
      };
    }

    // If it's not an array, return unchanged
    return prev;
  });
};


  const addArrayItem = (field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), ""],
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData((prev) => {
      const arr = prev[field as keyof typeof prev];
      if (Array.isArray(arr)) {
        return {
          ...prev,
          [field]: arr.filter((_: any, i: number) => i !== index),
        };
      }
      return prev;
    });
  }

  const addVariant = () => {
    const newVariant: ProductVariantForm = {
      id: `variant-${Date.now()}`,
      name: "",
      price: 0,
      description: "",
    }
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, newVariant],
    }))
  }

  const updateVariant = (variantId: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant) =>
        variant.id === variantId ? { ...variant, [field]: value } : variant
      ),
    }))
  }

  const removeVariant = (variantId: string) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((variant) => variant.id !== variantId),
    }))
  }

  const addFile = () => {
    const newFile: DownloadFileForm = {
      id: `file-${Date.now()}`,
      name: "",
      url: "",
      type: "PDF",
    }
    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, newFile],
    }))
  }

  const updateFile = (fileId: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.map((file) =>
        file.id === fileId ? { ...file, [field]: value } : file
      ),
    }))
  }

  const removeFile = (fileId: string) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((file) => file.id !== fileId),
    }))
  }

  const handleSubmit = () => {
    console.log("Product data:", formData)
    router.push("/creator/products")
  }

  return (
    <ProductFormContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        formData,
        handleInputChange,
        handleArrayChange,
        addArrayItem,
        removeArrayItem,
        addVariant,
        updateVariant,
        removeVariant,
        addFile,
        updateFile,
        removeFile,
        handleSubmit,
      }}
    >
      {children}
    </ProductFormContext.Provider>
  )
}

export function useProductForm() {
  const context = useContext(ProductFormContext)
  if (!context) {
    throw new Error("useProductForm must be used within a ProductFormProvider")
  }
  return context
}
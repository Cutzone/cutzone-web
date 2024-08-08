import React, { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import Input from "@/components/atoms/Input/input";
import Button from "@/components/atoms/Button/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormErrorLabel from "@/components/atoms/FormError/formError";
import UploadMainImage from "@/components/molecules/UploadMainImage";
import { BarberServicesEntity } from "@/common/entities/barberServicesEntity";
import barberServicesFormSchema from "@/validations/barberServices";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNewServiceDoc,
  updateServiceDoc
} from "@/store/services/services";
import { storageGet } from "@/store/services/storage";

type barberServicesForm = z.infer<typeof barberServicesFormSchema>;

const Category = ({
  index,
  value,
  checked,
  handleCategoryClick,
  name
}: any) => {
  return (
    <div>
      <label htmlFor={`corte${index}`}>
        <div
          className={`cursor-pointer rounded-full border-2 border-primary-amber px-2 py-1 ${
            checked ? "bg-primary-amber" : ""
          }`}
        >
          <p>{name}</p>
        </div>
      </label>
      <input
        type="checkbox"
        id={`corte${index}`}
        className="hidden"
        value={value}
        checked={checked}
        onChange={() => handleCategoryClick(index)}
      />
    </div>
  );
};

interface ServiceModalProps {
  service?: BarberServicesEntity;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDialogOpen: boolean;
  type: "edit" | "create";
  url: string;
}

const ServiceModal = ({
  service,
  isDialogOpen,
  setIsDialogOpen,
  type,
  url
}: ServiceModalProps) => {
  const [downloadURL, setDownloadURL] = useState(url);
  const [mainImageError, setMainImageError] = useState("");
  const [categoriesError, setCategoriesError] = useState("");
  const [categories, setCategories] = useState<string[]>(
    type === "edit" ? service?.category || [] : []
  );
  const [possibleCategories, setPossibleCategories] = useState([
    {
      value: "corte",
      checked:
        type === "edit" ? service?.category.includes("corte") || false : false,
      name: "Corte"
    },
    {
      value: "barba",
      checked:
        type === "edit" ? service?.category.includes("barba") || false : false,
      name: "Barba"
    },
    {
      value: "sobrancelha",
      checked:
        type === "edit"
          ? service?.category.includes("sobrancelha") || false
          : false,
      name: "Sobrancelha"
    }
  ]);

  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<barberServicesForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(barberServicesFormSchema),
    values:
      type === "edit" && service
        ? {
            name: service.name,
            description: service.description,
            price: service.price,
            averageServiceTime: service.averageServiceTime
          }
        : {
            name: "",
            description: "",
            price: "" as unknown as number,
            averageServiceTime: "" as unknown as number
          }
  });

  const mutationEdit = useMutation(
    (formData: barberServicesForm) => {
      return updateServiceDoc(
        { ...formData, photo: downloadURL, category: categories },
        service?.id as string,
        storageGet("uid") as string
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["services"]);
        await queryClient.invalidateQueries(["appointments"]);
        setIsDialogOpen(false);
      }
    }
  );

  const mutationCreate = useMutation(
    (formData: barberServicesForm) => {
      return createNewServiceDoc(
        { ...formData, photo: downloadURL, category: categories },
        storageGet("uid") as string
      );
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["services"]);
        setIsDialogOpen(false);
      }
    }
  );

  const handleFormSubmit = async (data: barberServicesForm) => {
    if (downloadURL === "") {
      setMainImageError("Selecione uma imagem");
      return;
    }

    if (categories.length === 0) {
      setCategoriesError("Selecione pelo menos uma categoria");
      return;
    }

    if (type === "edit") {
      await mutationEdit.mutateAsync(data);
    } else {
      await mutationCreate.mutateAsync(data);
    }
  };

  const handleCategoryClick = (index: number) => {
    setCategoriesError("");

    if (possibleCategories[index].checked) {
      setPossibleCategories((prevCategories) =>
        prevCategories.map((category) => {
          if (possibleCategories[index].value === category.value) {
            return { ...category, checked: false };
          }
          return category;
        })
      );

      setCategories((prevCategories) => [
        ...prevCategories.filter(
          (category) => category !== possibleCategories[index].value
        )
      ]);
    } else {
      setPossibleCategories((prevCategories) =>
        prevCategories.map((category) => {
          if (possibleCategories[index].value === category.value) {
            return { ...category, checked: true };
          }
          return category;
        })
      );

      setCategories((prevCategories) => [
        ...prevCategories,
        possibleCategories[index].value
      ]);
    }
  };

  return (
    <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
      <DialogContent
        className="w-80 rounded-xl bg-white shadow"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <p className="">{type === "edit" ? "Editar" : "Criar"} serviço</p>
            <div
              className="cursor-pointer font-bold"
              onClick={() => setIsDialogOpen(false)}
            >
              <CloseOutlined />
            </div>
          </DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <UploadMainImage
            downloadURL={downloadURL}
            setDownloadURL={setDownloadURL}
            mainImageError={mainImageError}
            setMainImageError={setMainImageError}
            size="small"
          >
            Foto
          </UploadMainImage>
          <Input
            bgColor="bg-white"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Nome do serviço"
            placeholder="Insira o nome"
            formRegister={register}
            name="name"
            formErrors={errors}
          />
          <Input
            bgColor="bg-white"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Descrição"
            placeholder="Insira a descrição"
            formRegister={register}
            name="description"
            formErrors={errors}
          />
          <div className="flex flex-1 items-center gap-2">
            <Input
              label="Preço"
              placeholder="Preço (em reais)"
              formRegister={register}
              name="price"
              formErrors={errors}
              bgColor="bg-white"
              textColor="text-primary-amber"
              borderColor="border-primary-amber"
            />
            <Input
              label="Duração"
              placeholder="Insira a duração (min)"
              formRegister={register}
              name="averageServiceTime"
              formErrors={errors}
              bgColor="bg-white"
              textColor="text-primary-amber"
              borderColor="border-primary-amber"
            />
          </div>
          <div className="mb-4 ml-1 mt-1">
            <p className="text-primart-amber mb-2 font-bold text-primary-amber">
              Categorias:
            </p>
            <div className="flex flex-wrap gap-3">
              {possibleCategories.map((category, i) => {
                return (
                  <Category
                    value={category.value}
                    checked={category.checked}
                    name={category.name}
                    handleCategoryClick={handleCategoryClick}
                    index={i}
                    key={i}
                  />
                );
              })}
            </div>
            <div className="mt-2">
              <FormErrorLabel>{categoriesError}</FormErrorLabel>
            </div>
          </div>
          <div className="flex justify-center">
            <Button
              borderColor="border-[#B7864B]"
              textColor="text-black"
              hover="hover:bg-white bg-[#B7864B]"
              type="submit"
            >
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModal;

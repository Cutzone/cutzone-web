import { Separator } from "@/components/ui/separator";
import barberServicesFormSchema from "@/validations/barberServices";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormErrorLabel from "@/components/atoms/FormError/formError";
import { useState } from "react";
import UploadMainImage from "@/components/molecules/UploadMainImage";
import Button from "@/components/atoms/Button/button";
import Input from "@/components/atoms/Input/input";

interface ServiceFormProps {
  handleAddService: () => void;
  setServices: (services: any) => void;
  number: number;
}

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
          className={`cursor-pointer rounded-full border-2 border-primary-amber px-2 py-1 text-sm sm:text-base ${
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

function ServiceForm({
  handleAddService,
  setServices,
  number
}: ServiceFormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    getValues
  } = useForm<barberServicesForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(barberServicesFormSchema)
  });

  const [possibleCategories, setPossibleCategories] = useState([
    { value: "corte", checked: false, name: "Corte" },
    { value: "barba", checked: false, name: "Barba" },
    { value: "sobrancelha", checked: false, name: "Sobrancelha" }
  ]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesError, setCategoriesError] = useState("");
  const [downloadURL, setDownloadURL] = useState("");
  const [mainImageError, setMainImageError] = useState("");

  const handleSubmitForm = (data: barberServicesForm) => {
    if (downloadURL === "") {
      setMainImageError("Insira uma imagem");
      return;
    }

    if (categories.length === 0) {
      setCategoriesError("Selecione pelo menos uma categoria");
      return;
    }

    setServices((prevServices: any) => [
      ...prevServices,
      { ...data, category: categories, photo: downloadURL }
    ]);
    handleAddService();
    console.log(data);
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

  console.log(categories);

  return (
    <form className="w-full max-w-lg" onSubmit={handleSubmit(handleSubmitForm)}>
      <p className="mb-2 ml-2 font-bold">Serviço {number}</p>

      <div className="flex items-center justify-between gap-5">
        <div className="flex grow flex-col gap-1">
          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Nome do serviço"
            placeholder="Insira o nome"
            name="name"
            formRegister={register}
            formErrors={errors}
            className="my-1 text-sm"
          />
          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Descrição"
            placeholder="Insira a descrição"
            name="description"
            formRegister={register}
            formErrors={errors}
            className="my-1 text-sm"
          />
          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Preço"
            placeholder="Insira o preço (em reais)"
            name="price"
            formRegister={register}
            formErrors={errors}
            className="my-1 text-sm"
          />
          <Input
            bgColor="bg-[#fafafa]"
            textColor="text-primary-amber"
            borderColor="border-primary-amber"
            label="Duração"
            placeholder="Insira a duração média (min)"
            name="averageServiceTime"
            formRegister={register}
            formErrors={errors}
            className="my-1 text-sm"
          />
        </div>

        <div>
          <UploadMainImage
            downloadURL={downloadURL}
            setDownloadURL={setDownloadURL}
            mainImageError={mainImageError}
            setMainImageError={setMainImageError}
            size="small"
          >
            Foto
          </UploadMainImage>
        </div>
      </div>

      <div className="mt-3">
        <p className="mb-2">Categorias:</p>
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

      <Separator className="my-3 bg-primary-light-gray" />
      <Button
        borderColor="border-primary-amber"
        hover="hover:bg-primary-amber"
        className="px-2 py-1 font-normal"
        type="submit"
      >
        Adicionar Serviço +
      </Button>
    </form>
  );
}

export default ServiceForm;

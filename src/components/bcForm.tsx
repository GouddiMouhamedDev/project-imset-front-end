import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ApiClientData, SlecteClientData } from "@/types/clients";
import { Calendar } from "./ui/calendar";
import { getClientsData } from "@/api/clients";
import { auth, removeStorage } from "@/api/auth";
import { ProduitData, ProduitDataBon } from "@/types/produits";
import { getProduitsData } from "@/api/produits";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createBonCommande } from "@/api/bonCommandes";
import { format } from 'date-fns';

const FormSchema = z.object({
  client: z.string({
    required_error: "Veuillez sélectionner un client.",
  }),
  date: z.coerce.date({
    required_error: "Veuillez sélectionner une date.",
  }),
  produits: z.array(
    z.object({
      nom: z.string(),
      prixUnitaireHT: z.number(),
      prixUnitaireTTC: z.number(),
      tauxTVA: z.number(),
      idProduit: z.number(),
      quantite: z.number().default(1),
      montantTTC: z.number(),
    })
  ),
});

export function BonCommandeForm() {
  const [clientsData, setClientsData] = useState<SlecteClientData[]>([]);
  const [produitData, setProduitData] = useState<ProduitData[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProduitDataBon[]>([]);
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { produits: [] },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const { date, ...dataWithDate } = { ...data, dateCommande: data.date };

    let prixTotalHT = 0;
    let montantTVA = 0;
    let prixTotalTTC = 0;
  
    const produits = selectedProducts.map((product) => {
      const montantTTC = product.prixUnitaireTTC * product.quantite;
      prixTotalHT += product.prixUnitaireHT * product.quantite;
      montantTVA += montantTTC - product.prixUnitaireHT * product.quantite;
      prixTotalTTC += montantTTC;
  
      return {
        produit: product.produit,
        idProduit: product.idProduit,
        nomProduit: product.nom,
        quantite: product.quantite,
        prixUnitaireHT: product.prixUnitaireHT,
        prixUnitaireTTC: product.prixUnitaireTTC,
        tauxTVA: product.tauxTVA,
        montantTTC: montantTTC,
      };
    });
  
    const dataWithProducts = { ...dataWithDate, produits, prixTotalHT, montantTVA, prixTotalTTC };

    try {
      const response = await createBonCommande(dataWithProducts);
      console.log("response Bon de commande créé :", response);
    } catch (error) {
      console.error("Une erreur s'est produite lors de la création du bon de commande :", error);
    }
  };

  const addSelectedProduct = (produit: ProduitData) => {
    const montantTTC = produit.prixUnitaireTTC * (produit.quantité ?? 1);
    const newProduct: ProduitDataBon = {
      ...produit,
      quantite: produit.quantité ?? 1,
      montantTTC: montantTTC,
    };
    setSelectedProducts([...selectedProducts, newProduct]);
  };

  const fetchProductsData = async () => {
    try {
      const data: ProduitData[] = await getProduitsData();
      setProduitData(data);
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données des produits :",
        error
      );
    }
  };
  
  const fetchClientData = async () => {
    try {
      const data: ApiClientData[] = await getClientsData();
      const formatedData: any[] = data.map((client) => ({
        Id: client._id,
        Nom: client.nom,
        idClient: client.idClient,
      }));
      setClientsData(formatedData);
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données des clients :",
        error
      );
    }
  };

  useEffect(() => {
    const fetchDataAfterAuth = async () => {
      const isAuthenticated = auth(["admin", "super-admin", "user"]);
      if (isAuthenticated) {
        await Promise.all([fetchProductsData(), fetchClientData()]);
      } else {
        removeStorage();
        router.push("/login");
      }
    };

    fetchDataAfterAuth();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-row">
          <FormField
            control={form.control}
            name="client"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Client : </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? clientsData.find(
                              (client) => client.Id === field.value
                            )?.Nom
                          : "Select client"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search client..." />
                      <CommandEmpty>No client found.</CommandEmpty>
                      <CommandGroup>
                        {clientsData.map((client) => (
                          <CommandItem
                            value={`${client.idClient}-${client.Nom}`}
                            key={client.Id}
                            onSelect={() => {
                              form.setValue("client", client.Id);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                client.Id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {`${client.idClient} - ${client.Nom}`}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                   <Button
        variant="outline"
        className={cn(
          "w-[240px] pl-3 text-left font-normal",
          !field.value && "text-muted-foreground"
        )}
      >
        {field.value ? (
          format(field.value, 'dd MMMM yyyy') // Removed timeZone option
        ) : (
          <span>Sélectionnez une date</span>
        )}
        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Sélectionnez une date pour la commande.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="produits"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Produit :</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-[200px] justify-between",
                      !field.value.length && "text-muted-foreground"
                    )}
                  >
                    {field.value.length > 0
                      ? `${field.value.length} produit(s) sélectionné(s)`
                      : "Sélectionner des produits"}
                    {field.value.length > 0 && (
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Rechercher un produit..." />
                    <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
                    <CommandGroup>
                      {produitData.map((produit) => (
                        <CommandItem
                          value={`${produit.idProduit} - ${produit.nom}`}
                          key={produit.produit}
                          onSelect={() => {
                            addSelectedProduct(produit);
                          }}
                        >
                          {`${produit.idProduit} - ${produit.nom}`}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <SelectedProductsTable
            products={selectedProducts.map((product) => ({
              ...product,
              quantite: product.quantite ?? 1,
              montantTTC: product.montantTTC ?? (product.prixUnitaireTTC * (product.quantite ?? 1)),
            }))}
          />
        </FormItem>
        <Button type="submit">Soumettre</Button>
      </form>
    </Form>
  );
}

function SelectedProductsTable({ products }: { products: ProduitDataBon[] }) {
  return (
    <Table>
      <TableCaption>Liste des produits sélectionnés</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ID Produit</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Prix unitaire HT</TableHead>
          <TableHead>Taux TVA</TableHead>
          <TableHead>Prix unitaire TTC</TableHead>
          <TableHead>Quantité</TableHead>
          <TableHead>Montant TTC</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => (
          <TableRow key={index}>
            <TableCell>{product.idProduit}</TableCell>
            <TableCell>{product.nom}</TableCell>
            <TableCell>{product.prixUnitaireHT}</TableCell>
            <TableCell>{product.tauxTVA}</TableCell>
            <TableCell>{product.prixUnitaireTTC}</TableCell>
            <TableCell>{product.quantite}</TableCell>
            <TableCell>{product.montantTTC}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
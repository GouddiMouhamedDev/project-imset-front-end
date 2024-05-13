"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MdDeleteForever } from "react-icons/md";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { createBonCommande } from "@/api/bonCommandes";
import { getClientsData } from "@/api/clients";
import { getProduitsData } from "@/api/produits";
import { auth, getUserInfoFromStorage, removeStorage } from "@/api/auth";
import { ProduitData, ProduitDataBon } from "@/types/produits";
import { ApiClientData, SlecteClientData } from "@/types/clients";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Form, FormDescription, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "./ui/calendar";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";





// Schéma pour le formulaire de bon de commande
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
  destination: z.string().optional(),
  prixTotalHT: z.number(), 
  montantTVA: z.number(),
  prixTotalTTC: z.number(),
});



interface SelectedProductsTableProps {
  products: ProduitDataBon[];
  onDeleteProduct: (index: number) => void;
  updateProduct: (index: number, key: keyof ProduitDataBon, value: string | number) => void;
  isHTActive: boolean;
}



function SelectedProductsTable({ products, onDeleteProduct, updateProduct ,isHTActive}: SelectedProductsTableProps) {
  return (
    <Table>
      <TableCaption></TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Ref Produit</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Prix unitaire HT</TableHead>
          <TableHead>Taux TVA</TableHead>
          <TableHead>Prix unitaire TTC</TableHead>
          <TableHead>Quantité</TableHead>
          <TableHead>Montant TTC</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product, index) => (
          <TableRow key={index}>
            <TableCell>{product.idProduit}</TableCell>
            <TableCell>
              <Input
                type="text"
                value={product.nom}
                onChange={(e) => updateProduct(index, 'nom', e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                value={product.prixUnitaireHT}
                onChange={(e) => updateProduct(index, 'prixUnitaireHT', parseFloat(e.target.value))}
                disabled={!isHTActive}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                value={product.tauxTVA}
                onChange={(e) => updateProduct(index, 'tauxTVA', parseFloat(e.target.value))}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                value={product.prixUnitaireTTC}
                onChange={(e) => updateProduct(index, 'prixUnitaireTTC', parseFloat(e.target.value))}
                disabled={isHTActive}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                value={product.quantite}
                onChange={(e) => updateProduct(index, 'quantite', parseInt(e.target.value))}
              />
            </TableCell>
            <TableCell>{product.montantTTC}</TableCell>
            <TableCell>
              <button onClick={() => onDeleteProduct(index)} className="w-4 h-4 cursor-pointer hover:scale-[1.1]">
                <MdDeleteForever />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function BonCommandeForm() {
  const [clientsData, setClientsData] = useState<SlecteClientData[]>([]);
  const [produitData, setProduitData] = useState<ProduitData[]>([]);
  const [destination, setDestination] = useState("");
  const [vendeurId, setVendeurId] = useState(""); 
  const [selectedProducts, setSelectedProducts] = useState<ProduitDataBon[]>([]);
  const [isHTActive, setIsHTActive] = useState(false);

  const router = useRouter();

 
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { produits: [] },
  });

     const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("Submitting data:", data); 
    // Calculs globaux avant la soumission du formulaire
    calculateGlobalValues(selectedProducts);
   
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
  
    const dataWithProducts = {
      ...dataWithDate,
      userId: vendeurId,
      destination: destination,
      produits,
      prixTotalHT,
      montantTVA,
      prixTotalTTC,
    };
  
    try {
   
      const response = await createBonCommande(dataWithProducts);
      console.log(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la création du bon de commande :",
        error
      );
    }
  };




  const toggleSlider = () => {
    setIsHTActive(!isHTActive);
  };


  
  const updateProduct = (index: number, key: keyof ProduitDataBon, value: string | number) => {
    const updatedProducts: ProduitDataBon[] = [...selectedProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [key]: value,
    };
  
    // Mise à jour des autres champs en fonction du champ modifié
    const updatedProduct = updatedProducts[index];
    if (key === 'prixUnitaireHT' || key === 'prixUnitaireTTC' || key === 'tauxTVA' || key === 'quantite') {
      const prixUnitaireHT = parseFloat(updatedProduct.prixUnitaireHT.toString());
      const prixUnitaireTTC = parseFloat(updatedProduct.prixUnitaireTTC.toString());
      const tauxTVA = parseFloat(updatedProduct.tauxTVA.toString());
      const quantite = parseFloat(updatedProduct.quantite.toString());
  
      if (isHTActive) {
        // Si le HT est actif, calcule le TTC
        const prixUnitaireTTC = (prixUnitaireHT * (1 + tauxTVA / 100)).toFixed(3);
        const montantTTC = (parseFloat(prixUnitaireTTC) * quantite).toFixed(3);
        updatedProducts[index] = {
          ...updatedProducts[index],
          prixUnitaireTTC: parseFloat(prixUnitaireTTC),
          montantTTC: parseFloat(montantTTC),
        };
      } else {
        // Sinon, calcule le HT
        const prixUnitaireHT = (prixUnitaireTTC / (1 + tauxTVA / 100)).toFixed(3);
        const montantTTC = (prixUnitaireTTC * quantite).toFixed(3);
        updatedProducts[index] = {
          ...updatedProducts[index],
          prixUnitaireHT: parseFloat(prixUnitaireHT),
          montantTTC: parseFloat(montantTTC),
        };
      }
    }
  
    setSelectedProducts(updatedProducts);
  };
  
  
  
  const calculateGlobalValues = (products: ProduitDataBon[]) => {
    let prixTotalHT = 0;
    let montantTVA = 0;
    let prixTotalTTC = 0;
  
    products.forEach((product) => {
      const montantTTC = product.prixUnitaireTTC * product.quantite;
      prixTotalHT += product.prixUnitaireHT * product.quantite;
      montantTVA += montantTTC - product.prixUnitaireHT * product.quantite;
      prixTotalTTC += montantTTC;
    });
  
    // Mettre à jour les valeurs globales dans le formulaire
    form.setValue('prixTotalHT', prixTotalHT);
    form.setValue('montantTVA', montantTVA);
    form.setValue('prixTotalTTC', prixTotalTTC);
  };
  
  
  const addSelectedProduct = (produit: ProduitData) => {
    const montantTTC = produit.prixUnitaireTTC * (produit.quantité ?? 1);
    const newProduct: ProduitDataBon = {
      ...produit,
      quantite: produit.quantité ?? 1,
      montantTTC: montantTTC,
    };
    // Ajout du nouveau produit
    setSelectedProducts([...selectedProducts, newProduct]);
  };
  

  const deleteSelectedProduct = (index: number) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);
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
        destination:client.destination
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
        const vendeurId = getUserInfoFromStorage()?._id;
        setVendeurId(vendeurId!);
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
        <div className="flex flex-row space-x-3">
          {/**selecte client */}
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
                      <CommandList>
                      <CommandGroup>
                        {clientsData.map((client) => (
                          <CommandItem
                            value={`${client.idClient}-${client.Nom}`}
                            key={client.Id} // Assurez-vous que client.Id est une clé unique
                            onSelect={() => {
                              form.setValue("client", client.Id);
                              setDestination(client.destination || "");
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
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
          {/** selecte date */}
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
                          format(field.value, "dd MMMM yyyy")
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
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
                  {/**destination clients  */}
        <FormField
  control={form.control}
  name="destination"
  render={({ field }) => (
    <FormItem className="flex flex-col">
      <FormLabel>Destination :</FormLabel>
      <Input
        {...field}
        defaultValue={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="form-input"
      />
    </FormItem>
  )}
/>
        </div>
        {/**selecte produit */}
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
                          key={produit.idProduit}
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
                  {/** slider */}
                  <div className="inline-flex justify-center space-x-2">
  <label htmlFor="toggleSlider">HT</label>
  <div className="relative w-10 h-5 cursor-pointer" onClick={toggleSlider}>
    <div className={`absolute left-0 w-full h-full bg-gray-600 rounded-full p-1 `}></div>
    <div className={`absolute top-0 left-0 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isHTActive ? '' : 'translate-x-full'}`}></div>
  </div>
  <label htmlFor="toggleSlider">TTC</label>
</div>
  {/* Ajoutez un Card pour afficher les totaux */}
  <Card className="mt-4 w-auto">
  <h2 className="text-xl font-semibold">Totaux</h2>
        <p>Prix total HT : {form.getValues("prixTotalHT")}</p>
        <p>Montant TVA : {form.getValues("montantTVA")}</p>
        <p>Prix total TTC : {form.getValues("prixTotalTTC")}</p>
      </Card>
        {/** tableau des produits */}
        <FormItem>
          <SelectedProductsTable
            products={selectedProducts.map((product) => ({
              ...product, 
              quantite: product.quantite ?? 1,
              montantTTC: product.montantTTC ?? product.prixUnitaireTTC * (product.quantite ?? 1),
            }))}
            onDeleteProduct={deleteSelectedProduct}
            updateProduct={updateProduct}
            isHTActive={isHTActive} 
          />
        </FormItem>
   



        <Button type="submit">Soumettre</Button>
      </form>
    </Form>
  );
}



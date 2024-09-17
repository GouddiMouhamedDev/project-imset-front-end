"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
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
import { getClientsData } from "@/api/clients";
import { auth, getUserInfoFromStorage, removeStorage } from "@/api/auth";
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
import {  getOneBonCommandeData, updateBonCommandeData } from "@/api/bonCommandes";
import { format, getDate } from "date-fns";
import { MdDeleteForever } from "react-icons/md";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { BonCommandeData } from "@/types/bonCommande";



export default function EditBonCommande({
  params: { id },
}: {
  params: { id: string };
}) {




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
  });

  const [clientsData, setClientsData] = useState<SlecteClientData[]>([]);
  const [produitData, setProduitData] = useState<ProduitData[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProduitDataBon[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [prixTotalHT, setPrixTotalHT] = useState(0);
  const [prixTotalTTC, setPrixTotalTTC] = useState(0);
  const [montantTVA, setMontantTVA] = useState(0);
  const [responseStatus, setResponseStatus] = useState(-1);
  const [isHTActive, setIsHTActive] = useState(false);
  const [msg, setMsg] = useState<string>("");
  const [vendeurId, setVendeurId] = useState("");

  const calculateTotals = (products: ProduitDataBon[]) => {
    let prixTotalHT = 0;
    let prixTotalTTC = 0;
    let montantTVA = 0;

    products.forEach((product) => {
      prixTotalHT += product.prixUnitaireHT * product.quantite;
      prixTotalTTC += product.prixUnitaireTTC * product.quantite;
      montantTVA +=
        (product.prixUnitaireTTC - product.prixUnitaireHT) * product.quantite;
    });

    // Arrondir les totaux à trois chiffres après la virgule
    prixTotalHT = parseFloat(prixTotalHT.toFixed(3));
    prixTotalTTC = parseFloat(prixTotalTTC.toFixed(3));
    montantTVA = parseFloat(montantTVA.toFixed(3));

    return { prixTotalHT, prixTotalTTC, montantTVA };
  };

  const updateProduct = (
    index: number,
    key: keyof ProduitDataBon,
    value: string | number
  ) => {
    const updatedProducts: ProduitDataBon[] = [...selectedProducts];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [key]: value,
    };

    // Mise à jour des autres champs en fonction du champ modifié
    const updatedProduct = updatedProducts[index];
    if (
      key === "prixUnitaireHT" ||
      key === "prixUnitaireTTC" ||
      key === "tauxTVA" ||
      key === "quantite"
    ) {
      const prixUnitaireHT = parseFloat(
        updatedProduct.prixUnitaireHT.toString()
      );
      const prixUnitaireTTC = parseFloat(
        updatedProduct.prixUnitaireTTC.toString()
      );
      const tauxTVA = parseFloat(updatedProduct.tauxTVA.toString());
      const quantite = parseFloat(updatedProduct.quantite.toString());

      if (isHTActive) {
        // Si le HT est actif, calcule le TTC
        const prixUnitaireTTC = (prixUnitaireHT * (1 + tauxTVA / 100)).toFixed(
          3
        );
        const montantTTC = (parseFloat(prixUnitaireTTC) * quantite).toFixed(3);
        updatedProducts[index] = {
          ...updatedProducts[index],
          prixUnitaireTTC: parseFloat(prixUnitaireTTC),
          montantTTC: parseFloat(montantTTC),
        };
      } else {
        // Sinon, calcule le HT
        const prixUnitaireHT = (prixUnitaireTTC / (1 + tauxTVA / 100)).toFixed(
          3
        );
        const montantTTC = (prixUnitaireTTC * quantite).toFixed(3);
        updatedProducts[index] = {
          ...updatedProducts[index],
          prixUnitaireHT: parseFloat(prixUnitaireHT),
          montantTTC: parseFloat(montantTTC),
        };
      }
    }

    setSelectedProducts(updatedProducts);

    // Calculer les totaux et mettre à jour les états
    const { prixTotalHT, prixTotalTTC, montantTVA } =
      calculateTotals(updatedProducts);
    // Mettre à jour les états des totaux
    // Je suppose que vous avez des états pour stocker ces valeurs, sinon, vous devez les ajouter.
    setPrixTotalHT(prixTotalHT);
    setPrixTotalTTC(prixTotalTTC);
    setMontantTVA(montantTVA);
  };

  const toggleSlider = () => {
    setIsHTActive(!isHTActive);
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { produits: [] },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    try {
      // Créer un tableau pour stocker les produits
    
      const produitsData = selectedProducts.map((product) => ({
        produit: product.produit, // Utiliser l'ID du produit
        idProduit: product.idProduit, // Utiliser l'ID du produit
        nomProduit: product.nom, // Utiliser le nom du produit
        quantite: product.quantite, // Utiliser la quantité du produit
        prixUnitaireHT: product.prixUnitaireHT, // Utiliser le prix unitaire HT du produit
        prixUnitaireTTC: product.prixUnitaireTTC, // Utiliser le prix unitaire TTC du produit
        tauxTVA: product.tauxTVA, // Utiliser le taux TVA du produit
        montantTTC: product.montantTTC, // Utiliser le montant TTC du produit
      }));

      // Créer un objet contenant les données de la commande avec le tableau de produits
      const bonCommandeData = {
        dateCommande: format(data.date, "yyyy-MM-dd"), // Utiliser la date sélectionnée
        client: data.client, // Ajouter l'ID du client
        userId: vendeurId, // Utiliser l'ID du vendeur
        destination: destination, // Utiliser la destination sélectionnée
        produits: produitsData, // Utiliser le tableau de produits
        prixTotalHT: prixTotalHT, // Utiliser le prix total HT calculé
        montantTVA: montantTVA, // Utiliser le montant TVA calculé
        prixTotalTTC: prixTotalTTC, // Utiliser le prix total TTC calculé
      };
      // Envoyer les données au backend
    
      
      await updateBonCommandeData(id, bonCommandeData).then((response) => {
        const msg = (response as { data: { msg: string } }).data.msg;

        if ((response as { status: number }).status === 200) {
          toast.success(msg, {
            position: "top-right",
            className: "text-white bg-green-500",
          });
          router.push("/bonCommande");
        } else {
          toast.error(msg, {
            position: "top-right",
            className: "text-white bg-red-500",
          });
        }
      });
    } catch (error) {
      // Gérer les erreurs en cas d'échec de l'envoi
      console.error(
        "Une erreur s'est produite lors de la création du bon de commande :",
        error
      );
    } 
    setIsLoading(false);
  };

  const addSelectedProduct = (produit: ProduitData) => {
    const montantTTC = produit.prixUnitaireTTC * (produit.quantite ?? 1);
    const newProduct: ProduitDataBon = {
      ...produit,
      quantite: produit.quantite ?? 1,
      montantTTC: montantTTC,
      produit: produit.produit,
    };
    const updatedProducts = [...selectedProducts, newProduct];
    setSelectedProducts(updatedProducts);

    // Mettre à jour les totaux après l'ajout d'un produit
    const { prixTotalHT, prixTotalTTC, montantTVA } =
      calculateTotals(updatedProducts);
    setPrixTotalHT(prixTotalHT);
    setPrixTotalTTC(prixTotalTTC);
    setMontantTVA(montantTVA);
  };

  const deleteSelectedProduct = (index: number) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts.splice(index, 1);
    setSelectedProducts(updatedProducts);

    // Mettre à jour les totaux après la suppression d'un produit
    const { prixTotalHT, prixTotalTTC, montantTVA } =
      calculateTotals(updatedProducts);
    setPrixTotalHT(prixTotalHT);
    setPrixTotalTTC(prixTotalTTC);
    setMontantTVA(montantTVA);
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
        destination: client.destination,
      }));
      setClientsData(formatedData);
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données des clients :",
        error
      );
    }
  };

  const fetchOneBonCommande = async (id: string) => {
    try {
      const data: BonCommandeData = await getOneBonCommandeData(id);
     
    // Formater les données de la commande pour remplir le formulaire et le tableau des produits
     const formattedProducts = data.produits.map((produit) => ({
            idProduit: produit.idProduit,
  nom: produit.nomProduit,
  prixUnitaireHT: produit.prixUnitaireHT,
  prixUnitaireTTC: produit.prixUnitaireTTC,
  tauxTVA: produit.tauxTVA,
  quantite: produit.quantite,
  montantTTC: produit.montantTTC,
  produit: produit._id 
}));
 // Mettre à jour les états
 setSelectedProducts(formattedProducts);
 setDestination(data.destination);
 setPrixTotalHT(data.prixTotalHT);
 setPrixTotalTTC(data.prixTotalTTC);
 setMontantTVA(data.montantTVA);
 // Mettre à jour les valeurs du formulaire
 form.setValue("client", data.client);
 form.setValue("date", new Date(data.dateCommande));
 form.setValue("produits", formattedProducts);
 form.setValue("destination", data.destination);
     
    } catch (error) {
      console.error(
        "Une erreur s'est produite lors de la récupération des données d'un bon de commande :",
        error
      );
    }
  };


  const fetchDataAfterAuth = async () => {
    const isAuthenticated = auth(["admin", "super-admin", "user"]);
    if (isAuthenticated) {
      await Promise.all([
        fetchProductsData(),
        fetchClientData(),
        fetchOneBonCommande(id),
      ]);
      const vendeurId = getUserInfoFromStorage()?._id;
      setVendeurId(vendeurId!);
    } else {
      removeStorage();
      router.push("/login");
    }
  };
  useEffect(() => {


    fetchDataAfterAuth();
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-wrap justify-around">
          <div className="space-y-4">
            {/**client */}
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
                            "w-[250px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? clientsData.find(
                                (client) => client.Id === field.value
                              )?.Nom
                            : "Sélectionner un client"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Recherche Client..." />
                        <CommandEmpty>Aucun Client trouvé.</CommandEmpty>
                        <CommandGroup>
                          {clientsData.map((client) => (
                            <CommandItem
                              value={`${client.idClient}-${client.Nom}`}
                              key={client.Id}
                              onSelect={() => {
                                form.setValue("client", client.Id);
                                form.setValue(
                                  "destination",
                                  client.destination || ""
                                );
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
                      </Command>
                    </PopoverContent>
                  </Popover>

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
                    onChange={(e) => {
                      form.setValue("destination", e.target.value);
                      setDestination(e.target.value);
                    }}
                    className="form-input"
                  />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4">
            {/**date */}
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
                            format(field.value, "dd MMMM yyyy") // Removed timeZone option
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
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/**produits */}
            <FormField
              control={form.control}
              name="produits"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Produit :</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[250px] justify-between",
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
                      </FormControl>
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
          </div>
          {/** Card info */}
          <div className="  space-x-10 text-sm ">
            <Card className="p-6  space-y-3">
              <div>Total HT : {prixTotalHT}</div>
              <div>Total TVA: {montantTVA}</div>
              <div>Total TTC: {prixTotalTTC}</div>
              {/** slider */}
              <div className="inline-flex justify-center space-x-2">
                <label htmlFor="toggleSlider">HT</label>
                <div
                  className="relative w-10 h-5 cursor-pointer"
                  onClick={toggleSlider}
                >
                  <div
                    className={`absolute left-0 w-full h-full bg-gray-600 rounded-full p-1 `}
                  ></div>
                  <div
                    className={`absolute top-0 left-0 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      isHTActive ? "" : "translate-x-full"
                    }`}
                  ></div>
                </div>
                <label htmlFor="toggleSlider">TTC</label>
              </div>
            </Card>
          </div>
        </div>
        {/** tableau des produits */}
        <FormItem>
          <SelectedProductsTable
            products={selectedProducts.map((product) => ({
              ...product,
              quantite: product.quantite ?? 1,
              montantTTC:
                product.montantTTC ??
                product.prixUnitaireTTC * (product.quantite ?? 1),
            }))}
            onDeleteProduct={deleteSelectedProduct}
            updateProduct={updateProduct}
            isHTActive={isHTActive}
          />
        </FormItem>
        <div className="flex justify-end pr-5">
          <Button
            type="submit"
            disabled={isLoading}
            className=" w-32 flex items-center justify-center s"
          >
            {isLoading ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-30 animate-spin" />
              </>
            ) : (
              "Enregistrer"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

interface SelectedProductsTableProps {
  products: ProduitDataBon[];
  onDeleteProduct: (index: number) => void;
  updateProduct: (
    index: number,
    key: keyof ProduitDataBon,
    value: string | number
  ) => void;
  isHTActive: boolean;
}

function SelectedProductsTable({
  products,
  onDeleteProduct,
  updateProduct,
  isHTActive,
}: SelectedProductsTableProps) {
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
          <TableRow key={product.produit}>
            <TableCell>{product.idProduit}</TableCell>
            <TableCell>
              <Input
                type="text"
                value={product.nom}
                onChange={(e) => updateProduct(index, "nom", e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                value={product.prixUnitaireHT}
                onChange={(e) =>
                  updateProduct(
                    index,
                    "prixUnitaireHT",
                    parseFloat(e.target.value)
                  )
                }
                disabled={!isHTActive}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                value={product.tauxTVA}
                onChange={(e) =>
                  updateProduct(index, "tauxTVA", parseFloat(e.target.value))
                }
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                value={product.prixUnitaireTTC}
                onChange={(e) =>
                  updateProduct(
                    index,
                    "prixUnitaireTTC",
                    parseFloat(e.target.value)
                  )
                }
                disabled={isHTActive}
              />
            </TableCell>
            <TableCell>
              <Input
                type="number"
                value={product.quantite}
                onChange={(e) =>
                  updateProduct(index, "quantite", parseInt(e.target.value))
                }
              />
            </TableCell>
            <TableCell>{product.montantTTC}</TableCell>
            <TableCell>
              <button
                type="button"
                onClick={() => onDeleteProduct(index)}
                className="w-4 h-4 cursor-pointer hover:scale-[1.1]"
              >
                <MdDeleteForever />
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

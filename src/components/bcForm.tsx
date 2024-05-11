import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { toast } from "@/components/ui/use-toast";
import { getClientsData } from "@/api/clients";
import { auth, removeStorage } from "@/api/auth";
import { useEffect, useState } from "react";
import { ApiClientData} from "@/types/clients";

const FormSchema = z.object({
  client: z.string({
    required_error: "Please select a client.",
  }),
});
import { useRouter } from "next/navigation";
export function BonCommandeForm() {
  const [clientsData, setClientsData] = useState<any[]>([]);
  const router = useRouter();




  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }



  const fetchData = async () => {
    try {
     
        const data: ApiClientData[] = await getClientsData();
        const formatedData: any[] = data.map((client) => ({
          Id: client._id,
          Nom: client.nom,
          idClient : client.idClient
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
        await fetchData();
      } else {
        removeStorage();
        router.push("/login");
      }
    };

    fetchDataAfterAuth();
  }, [])

   
  

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="client"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Client</FormLabel>
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
                            (client) => client._id === field.value
                          )?.nom
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
                          value={`${client.idClient}-${client.nom}`}
                          key={client._id}
                          onSelect={() => {
                            form.setValue("client", client._id);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              client._id === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {`${client.idClient}-${client.nom}`}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the client that will be associated with the order.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

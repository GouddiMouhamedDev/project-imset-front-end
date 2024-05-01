"use client"
import { pswReset } from "@/api/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, Controller } from 'react-hook-form';
import { ResetFormData } from "@/interface/users";


export default function Reset() {
  const { control, handleSubmit, formState, setError } = useForm<ResetFormData>();
  const { isSubmitting } = formState;

  const onSubmit = async (formData: ResetFormData) => {
    // Effectuez la validation des mots de passe ici
    if (formData.newPassword !== formData.newPasswordConfirm) {
      setError('newPasswordConfirm', {
        type: 'manual',
        message: 'Les nouveaux mots de passe ne correspondent pas.'
      });
      return;
    }

    // Si les mots de passe correspondent, appelez votre fonction pswReset ici
    try {
      // Appelez pswReset avec les données du formulaire
      await pswReset(formData.email, formData.oldPassword, formData.newPassword, formData.newPasswordConfirm);
      console.log('Réinitialisation du mot de passe réussie !');
      // Effectuez une action de redirection ou montrez un message de succès
    } catch (error) {
      console.error("Une erreur s'est produite lors de la réinitialisation du mot de passe :", error);
      // Gérez les erreurs de réinitialisation du mot de passe
    }
  };

  return (
    
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => <Input {...field} id="email" type="email" placeholder="E-mail" />}
                />
              </div>
              <div>

                <Controller
                  name="oldPassword"
                  control={control}
                  render={({ field }) => <Input {...field} id="oldPassword" type="password" placeholder="Old Password" />}
                />
              </div>
              <div>

                <Controller
                  name="newPassword"
                  control={control}
                  render={({ field }) => <Input {...field} id="newPassword" type="password" placeholder="New Password" />}
                />
              </div>
              <div>

                <Controller
                  name="newPasswordConfirm"
                  control={control}
                  render={({ field }) => <Input {...field} id="newPasswordConfirm" type="password" placeholder="Password Confirm" />}
                />
                {formState.errors.newPasswordConfirm && (
                  <p className="text-red-500">{formState.errors.newPasswordConfirm.message}</p>
                )}
              </div>
            </div>
            <div className="mb-4">
              {/* Ajout d'une marge en bas */}
            </div>
            <div className="flex justify-center space-x-2">
              <Button type="submit" disabled={isSubmitting} className="w-full">
                Reset
              </Button>
              {isSubmitting && (
                <img src="/upload-icon.svg" alt="Upload" className="h-4 w-4 animate-spin" />
              )}
            </div>
          </form>
        </div>
      </div>

  );
}


import { useQuery } from "@tanstack/react-query";
import { getAssets } from "@/services/assetService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

interface DeleteDataFieldDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fieldName: string;
}

const DeleteDataFieldDialog: React.FC<DeleteDataFieldDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  fieldName,
}) => {
  // Get assets to check if any are using this field
  const { data: assets = [] } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets,
    enabled: isOpen, // Only fetch when dialog is open
  });

  // Check if any assets are using this field
  const assetsUsingField = assets.filter(
    asset => asset.customFields && fieldName in asset.customFields
  );

  const hasAssetsUsingField = assetsUsingField.length > 0;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the field "{fieldName}"{hasAssetsUsingField ? " and remove it from all assets where it's used" : ""}.
            This action cannot be undone.
          </AlertDialogDescription>
          
          {hasAssetsUsingField && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-700">Warning</p>
                  <p className="text-sm text-amber-600">
                    This field is currently used by {assetsUsingField.length} {assetsUsingField.length === 1 ? 'asset' : 'assets'}:
                  </p>
                  <ul className="mt-1 ml-4 text-sm text-amber-600 list-disc">
                    {assetsUsingField.slice(0, 5).map(asset => (
                      <li key={asset.id}>{asset.name}</li>
                    ))}
                    {assetsUsingField.length > 5 && (
                      <li>...and {assetsUsingField.length - 5} more</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDataFieldDialog;

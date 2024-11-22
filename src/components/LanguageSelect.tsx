import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const translations = [
  { id: "en.asad", name: "English - Muhammad Asad" },
  { id: "en.pickthall", name: "English - Pickthall" },
  { id: "fr.hamidullah", name: "French - Hamidullah" },
  { id: "tr.ates", name: "Turkish - Süleyman Ateş" },
  { id: "ur.maududi", name: "Urdu - Maududi" },
];

export function LanguageSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select translation" />
      </SelectTrigger>
      <SelectContent>
        {translations.map((translation) => (
          <SelectItem key={translation.id} value={translation.id}>
            {translation.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
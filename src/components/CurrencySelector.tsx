
import React from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

const CurrencySelector = () => {
  const { currencies, selectedCurrency, setSelectedCurrency } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="border-border w-20 gap-1">
          <span>{selectedCurrency.symbol}</span>
          <span>{selectedCurrency.code}</span>
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        {currencies.map((currency) => (
          <DropdownMenuItem
            key={currency.code}
            onClick={() => setSelectedCurrency(currency)}
            className={selectedCurrency.code === currency.code ? "bg-accent" : ""}
          >
            <div className="flex items-center justify-between w-full">
              <span>{currency.symbol} {currency.code}</span>
              <span className="text-muted-foreground text-xs">{currency.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;

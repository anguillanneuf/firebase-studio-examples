
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TipSplitter = () => {
  const [billAmount, setBillAmount] = useState<number | null>(null);
  const [tipPercentage, setTipPercentage] = useState<number | null>(null);
  const [numberOfPeople, setNumberOfPeople] = useState<number | null>(null);
  const [tipPerPerson, setTipPerPerson] = useState<number>(0);
  const [totalPerPerson, setTotalPerPerson] = useState<number>(0);

  const { toast } = useToast();

  useEffect(() => {
    if (
      billAmount !== null &&
      tipPercentage !== null &&
      numberOfPeople !== null &&
      billAmount >= 0 &&
      tipPercentage >= 0 &&
      numberOfPeople > 0
    ) {
      const tipAmount = (billAmount * (tipPercentage / 100));
      const totalBill = billAmount + tipAmount;
      setTipPerPerson(parseFloat((tipAmount / numberOfPeople).toFixed(2)));
      setTotalPerPerson(parseFloat((totalBill / numberOfPeople).toFixed(2)));
    } else {
      setTipPerPerson(0);
      setTotalPerPerson(0);
    }
  }, [billAmount, tipPercentage, numberOfPeople]);

  const handleCopyTip = () => {
    navigator.clipboard.writeText(tipPerPerson.toString());
    toast({
      title: "Tip amount copied!",
      description: "Tip per person amount copied to clipboard.",
    });
  };

  const handleCopyTotal = () => {
    navigator.clipboard.writeText(totalPerPerson.toString());
    toast({
      title: "Total amount copied!",
      description: "Total per person amount copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-lavender p-8 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Tip Splitter
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Calculate your share with ease!
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="billAmount" className="block text-sm font-medium text-gray-700">
              Bill Amount
            </Label>
            <div className="mt-1">
              <Input
                id="billAmount"
                type="number"
                placeholder="0.00"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-hot-pink focus:border-hot-pink sm:text-sm"
                onChange={(e) => setBillAmount(e.target.value === "" ? null : parseFloat(e.target.value))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="tipPercentage" className="block text-sm font-medium text-gray-700">
              Tip Percentage
            </Label>
            <div className="mt-1">
              <Input
                id="tipPercentage"
                type="number"
                placeholder="15"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-hot-pink focus:border-hot-pink sm:text-sm"
                onChange={(e) => setTipPercentage(e.target.value === "" ? null : parseFloat(e.target.value))}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="numberOfPeople" className="block text-sm font-medium text-gray-700">
              Number of People
            </Label>
            <div className="mt-1">
              <Input
                id="numberOfPeople"
                type="number"
                placeholder="1"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-hot-pink focus:border-hot-pink sm:text-sm"
                onChange={(e) => setNumberOfPeople(e.target.value === "" ? null : parseFloat(e.target.value))}
              />
            </div>
          </div>
          <div className="text-center">
            <div className="flex justify-between items-center">
              <span className="block text-sm font-medium text-gray-700">Tip per Person:</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold">${tipPerPerson.toFixed(2)}</span>
                <Button variant="ghost" size="icon" onClick={handleCopyTip}>
                  <Copy className="h-4 w-4 text-hot-pink" />
                </Button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="block text-sm font-medium text-gray-700">Total per Person:</span>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold">${totalPerPerson.toFixed(2)}</span>
                <Button variant="ghost" size="icon" onClick={handleCopyTotal}>
                  <Copy className="h-4 w-4 text-hot-pink" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipSplitter;

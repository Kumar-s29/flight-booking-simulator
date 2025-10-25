import { useState } from "react";
import { ArrowLeft, ShoppingBag, UtensilsCrossed, Wifi, Briefcase, Plus, Minus } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { motion } from "motion/react";

interface AddOnsPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function AddOnsPage({ onNavigate }: AddOnsPageProps) {
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>({});

  const addOns = [
    {
      id: 'baggage-15',
      category: 'Baggage',
      icon: ShoppingBag,
      title: 'Extra Baggage - 15kg',
      description: 'Add 15kg to your check-in allowance',
      price: 45,
      color: 'from-blue-600 to-blue-400'
    },
    {
      id: 'baggage-25',
      category: 'Baggage',
      icon: Briefcase,
      title: 'Extra Baggage - 25kg',
      description: 'Add 25kg to your check-in allowance',
      price: 70,
      color: 'from-blue-600 to-blue-400'
    },
    {
      id: 'meal-veg',
      category: 'Meals',
      icon: UtensilsCrossed,
      title: 'Vegetarian Meal',
      description: 'Freshly prepared vegetarian meal',
      price: 15,
      color: 'from-green-600 to-green-400'
    },
    {
      id: 'meal-nonveg',
      category: 'Meals',
      icon: UtensilsCrossed,
      title: 'Non-Vegetarian Meal',
      description: 'Premium non-vegetarian meal option',
      price: 18,
      color: 'from-green-600 to-green-400'
    },
    {
      id: 'wifi',
      category: 'Services',
      icon: Wifi,
      title: 'In-Flight WiFi',
      description: 'Unlimited WiFi for your flight',
      price: 12,
      color: 'from-purple-600 to-purple-400'
    },
    {
      id: 'priority',
      category: 'Services',
      icon: ShoppingBag,
      title: 'Priority Boarding',
      description: 'Board the aircraft first',
      price: 25,
      color: 'from-orange-600 to-orange-400'
    },
  ];

  const updateQuantity = (id: string, delta: number) => {
    setSelectedAddOns(prev => {
      const current = prev[id] || 0;
      const newValue = Math.max(0, current + delta);
      if (newValue === 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newValue };
    });
  };

  const totalCost = Object.entries(selectedAddOns).reduce((sum, [id, qty]) => {
    const addOn = addOns.find(a => a.id === id);
    return sum + (addOn?.price || 0) * qty;
  }, 0);

  const groupedAddOns = addOns.reduce((acc, addOn) => {
    if (!acc[addOn.category]) acc[addOn.category] = [];
    acc[addOn.category].push(addOn);
    return acc;
  }, {} as Record<string, typeof addOns>);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <Button
          variant="ghost"
          onClick={() => onNavigate('checkout')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Checkout
        </Button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl text-gray-900 mb-2">Enhance Your Journey</h1>
          <p className="text-gray-600">Add extras to make your flight more comfortable</p>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          {/* Add-ons List */}
          <div className="col-span-8 space-y-8">
            {Object.entries(groupedAddOns).map(([category, items], catIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: catIndex * 0.1 }}
              >
                <h2 className="text-2xl text-gray-900 mb-4">{category}</h2>
                <div className="grid grid-cols-1 gap-4">
                  {items.map((addOn, index) => {
                    const quantity = selectedAddOns[addOn.id] || 0;
                    return (
                      <Card
                        key={addOn.id}
                        className={`bg-white border-2 transition-all ${
                          quantity > 0 ? 'border-blue-500 shadow-lg' : 'border-transparent shadow-md'
                        }`}
                      >
                        <div className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <div className={`w-14 h-14 bg-gradient-to-br ${addOn.color} rounded-xl flex items-center justify-center`}>
                                <addOn.icon className="w-7 h-7 text-white" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg text-gray-900 mb-1">{addOn.title}</h3>
                                <p className="text-sm text-gray-600 mb-3">{addOn.description}</p>
                                <p className="text-2xl text-blue-600">${addOn.price}</p>
                              </div>
                            </div>

                            {quantity === 0 ? (
                              <Button
                                onClick={() => updateQuantity(addOn.id, 1)}
                                className="bg-gradient-to-r from-blue-600 to-blue-500"
                              >
                                <Plus className="w-4 h-4 mr-2" />
                                Add
                              </Button>
                            ) : (
                              <div className="flex items-center gap-3">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateQuantity(addOn.id, -1)}
                                  className="h-10 w-10"
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>
                                <span className="text-xl text-gray-900 w-8 text-center">{quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateQuantity(addOn.id, 1)}
                                  className="h-10 w-10"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className="col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24"
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg p-6">
                <h3 className="text-lg mb-4">Your Selections</h3>

                {Object.keys(selectedAddOns).length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No add-ons selected yet</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-4">
                      {Object.entries(selectedAddOns).map(([id, qty]) => {
                        const addOn = addOns.find(a => a.id === id);
                        if (!addOn) return null;
                        return (
                          <div key={id} className="flex justify-between text-sm">
                            <div className="flex-1">
                              <p className="text-gray-900">{addOn.title}</p>
                              <p className="text-xs text-gray-500">Qty: {qty}</p>
                            </div>
                            <span className="text-gray-900">${addOn.price * qty}</span>
                          </div>
                        );
                      })}
                    </div>

                    <Separator className="my-4" />
                  </>
                )}

                <div className="flex justify-between mb-6">
                  <span className="text-lg">Total Add-ons</span>
                  <span className="text-2xl text-blue-600">${totalCost}</span>
                </div>

                <Button
                  onClick={() => onNavigate('checkout', { addOns: selectedAddOns, totalCost })}
                  disabled={Object.keys(selectedAddOns).length === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 h-12"
                >
                  Continue to Checkout
                </Button>

                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900 mb-1">💡 Pro Tip</p>
                  <p className="text-xs text-blue-700">
                    Book add-ons now and save up to 30% compared to airport prices
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

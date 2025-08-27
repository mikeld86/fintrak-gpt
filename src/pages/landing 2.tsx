import { Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Calculator className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Financial Position Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quickly calculate your current financial position with cash counting, 
            weekly income and expense tracking, and automated balance calculations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-primary" />
                Cash Counter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Count Australian notes and coins with automatic subtotals and total calculation.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Weekly Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Track income and expenses for current and next week with customizable categories.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Auto Calculations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Real-time calculations cascade from cash counter through to final weekly balances.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button
            onClick={() => window.location.href = '/api/login'}
            size="lg"
          >
            Get Started - Sign In
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Your data will be securely saved and synced across devices
          </p>
        </div>
      </div>
    </div>
  );
}

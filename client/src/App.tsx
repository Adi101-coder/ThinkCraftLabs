import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import SmoothScroll from "@/components/smooth-scroll";
import { ShopProvider } from "@/contexts/ShopContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "@/pages/home";
import Shop from "@/pages/shop";
import Work from "@/pages/work";
import About from "@/pages/about";
import Wishlist from "@/pages/wishlist";
import Cart from "@/pages/cart";
import Profile from "@/pages/profile";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/work" component={Work} />
      <Route path="/about" component={About} />
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/cart" component={Cart} />
      <Route path="/profile" component={Profile} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ShopProvider>
          <TooltipProvider>
            <SmoothScroll>
              <Toaster />
              <Router />
            </SmoothScroll>
          </TooltipProvider>
        </ShopProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

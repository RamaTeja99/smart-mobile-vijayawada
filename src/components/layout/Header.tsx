import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Phone, Mail, User, LogOut, Settings, Shield } from "lucide-react";
import { useAuth } from "../../pages/AuthContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`;
    }
    if (user?.first_name) return user.first_name.charAt(0);
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "A";
  };

  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.first_name) return user.first_name;
    return user?.email || "Admin";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        {/* Desktop Navigation Left */}
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <img src="/favicon.ico" alt="Smart Mobile Logo" className="h-8 w-auto" />
            <span className="font-bold text-xl">SMART MOBILE</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`transition-colors hover:text-primary ${
                  isActive(item.href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Mobile Menu Button */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            {/* Mobile Brand */}
            <Link
              to="/"
              className="flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <Phone className="h-6 w-6 text-primary" />
              <span className="font-bold">MobileHub</span>
            </Link>
            {/* Mobile Nav Links */}
            <nav className="my-4 grid gap-2 py-6">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-2 py-1 text-lg ${
                    isActive(item.href) ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="border-t pt-4 mt-4">
              {/* Mobile Auth Section */}
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar_url} alt={getUserDisplayName()} />
                      <AvatarFallback className="bg-blue-600 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{getUserDisplayName()}</p>
                      <p className="text-xs text-gray-600">{user?.email}</p>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-blue-600" />
                        <span className="text-xs text-blue-600 capitalize">
                          {user?.role?.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full justify-start"
                    variant="ghost"
                    onClick={() => {
                      navigate("/admin/dashboard");
                      setIsOpen(false);
                    }}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="ghost"
                    onClick={() => {
                      navigate("/admin/profile");
                      setIsOpen(false);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    className="w-full justify-start text-red-600"
                    variant="ghost"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              ) : (
                <Link to="/admin/login" onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-start">
                    <User className="mr-2 h-4 w-4" /> Admin Login
                  </Button>
                </Link>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Actions (Right) */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Mobile inline brand */}
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link to="/" className="flex items-center space-x-2 md:hidden">
              <Phone className="h-6 w-6 text-primary" />
              <span className="font-bold">MobileHub</span>
            </Link>
          </div>

          {/* Desktop contact + auth */}
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
               <a href="mailto:smartmobile007788@gmail.com" className="flex items-center space-x-2">
              <Mail className="h-4 w-4 mr-2" /> smartmobile007788@gmail.com
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:flex">
               <a href="tel:+919985007788" className="flex items-center space-x-2">
              <Phone className="h-4 w-4 mr-2" /> +91 9985 007 788
              </a>
            </Button>

            {/* Auth dropdown for desktop */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar_url} alt={getUserDisplayName()} />
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="text-sm font-medium">{getUserDisplayName()}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-blue-600" />
                        <span className="text-xs text-blue-600 capitalize">
                          {user?.role?.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/admin/dashboard")}
                  >
                    <Settings className="mr-2 h-4 w-4" /> Admin Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => navigate("/admin/profile")}
                  >
                    <User className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/admin/login">
                <Button variant="ghost" size="sm">
                  <User className="mr-2 h-4 w-4" /> Admin Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

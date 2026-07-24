import Logo from "./logo.tsx";
import SearchBar from "./searchBar.tsx";
import UserMenu from "./userMenu.tsx";
const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 h-16 border-b bg-background">
      <div className="mx-auto flex h-full items-center justify-between px-4">
        <Logo />

        <SearchBar />

        <UserMenu />
      </div>
    </header>
  );
}

export default Navbar;
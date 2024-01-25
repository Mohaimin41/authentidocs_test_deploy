<script lang="ts">
    import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavBrand, NavLi, NavUl } from 'flowbite-svelte';
</script>

<Navbar fluid={false}>
    <NavBrand href="/">
        <img src="favicon.png" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" /> <!-- apatoto -->
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Authentidocs</span>
    </NavBrand>
    <NavUl >
        <NavLi href="/">Files</NavLi>
        <NavLi href="/about">Organizations</NavLi>
        <NavLi href="/docs/components/navbar">Teams</NavLi>
        <NavLi href="/pricing">Work Threads</NavLi>
        <NavLi href="/contact">Upload & Sign</NavLi>
    </NavUl>
    <div class="flex items-center md:order-2">
        <Avatar src="pochita.webp" />
    </div>
    <Dropdown placement="bottom" triggeredBy="#avatar-menu">
        <DropdownHeader>
          <span class="block text-sm">Bonnie Green</span>
          <span class="block truncate text-sm font-medium">name@flowbite.com</span>
        </DropdownHeader>
        <DropdownItem>Dashboard</DropdownItem>
        <DropdownItem>Settings</DropdownItem>
        <DropdownItem>Earnings</DropdownItem>
        <DropdownDivider />
        <DropdownItem>Sign out</DropdownItem>
      </Dropdown>
</Navbar>
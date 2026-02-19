-- DANGER: This drops ALL policies on products to ensure a clean slate
drop policy if exists "Public Products Access" on products;
drop policy if exists "Admin Products Modify" on products;
drop policy if exists "Admin Insert Products" on products;
drop policy if exists "Admin Update Products" on products;
drop policy if exists "Admin Delete Products" on products;

-- Re-enable RLS just to be sure
alter table products enable row level security;

-- Allow Public Read Access
create policy "Public Read"
  on products for select
  using ( true );

-- Allow Authenticated Users to DO EVERYTHING (Insert, Update, Delete, Select)
create policy "Admin Full Access"
  on products for all
  using ( auth.role() = 'authenticated' )
  with check ( auth.role() = 'authenticated' );

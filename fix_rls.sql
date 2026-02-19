-- 1. Remove the old "catch-all" policy that is failing
drop policy if exists "Admin Products Modify" on products;

-- 2. Create Explicit Policy for INSERT (Creation)
create policy "Admin Insert Products"
  on products for insert
  with check ( auth.role() = 'authenticated' );

-- 3. Create Explicit Policy for UPDATE (Editing)
create policy "Admin Update Products"
  on products for update
  using ( auth.role() = 'authenticated' );

-- 4. Create Explicit Policy for DELETE (Removing)
create policy "Admin Delete Products"
  on products for delete
  using ( auth.role() = 'authenticated' );

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  expo_push_token text,

  constraint username_length check (char_length(username) >= 3)
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create threats table
create table if not exists public.threats (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  domain text not null,
  "riskScore" integer,
  status text check (status in ('active', 'pending', 'resolved', 'ignored')) default 'active'
);

alter table public.threats enable row level security;

create policy "Threats are viewable by everyone."
  on threats for select
  using ( true );

create policy "Authenticated users can create threats."
  on threats for insert
  with check ( auth.role() = 'authenticated' );

create policy "Authenticated users can update threats."
  on threats for update
  using ( auth.role() = 'authenticated' );

-- Set up Realtime for threats
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'threats') then
    alter publication supabase_realtime add table threats;
  end if;
end
$$;

insert into categories (id, title, subtitle, href, icon) values
  ('appliances', 'Home Appliances', 'Comfort & efficiency', '/shop#appliances', '⚡'),
  ('household', 'Household Essentials', 'Everyday living upgrades', '/shop#household', '🏠'),
  ('souvenirs', 'Souvenirs', 'Events & celebrations', '/shop#souvenirs', '🎁'),
  ('gifts', 'Gift Items', 'Meaningful gifting', '/shop#gifts', '✨')
on conflict (id) do nothing;

INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, 
  email_confirmed_at, invited_at, confirmation_token, 
  confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, 
  email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, 
  raw_user_meta_data, is_super_admin, created_at, updated_at, 
  phone, phone_confirmed_at, phone_change, phone_change_token, 
  phone_change_sent_at, email_change_token_current, 
  email_change_confirm_status, banned_until, reauthentication_token, 
  reauthentication_sent_at, deleted_at, is_anonymous) 
  VALUES (
    '00000000-0000-0000-0000-000000000000', 
    '1ba96f8c-de50-4fad-a148-fea153ad382b', 
    'authenticated', 'authenticated', 'alpogos@gmail.com', '$2a$10$sE9hsthACf9RPZ.P2IAsMu1X6SFqoIxyVWzroZnrEUylJSBKvRWMq', 
    '2025-06-05 01:27:54.008098+00', NULL, '', NULL, '', NULL, '', '', NULL, NULL, 
    '{"provider": "email", "providers": ["email"]}', '{"email_verified": true}', NULL, '2025-06-05 01:27:54.004563+00', 
    '2025-06-05 01:27:54.008505+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, NULL, false);

INSERT INTO auth.identities 
  (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, id) 
  VALUES 
  ('1ba96f8c-de50-4fad-a148-fea153ad382b', '1ba96f8c-de50-4fad-a148-fea153ad382b', '{"sub": "1ba96f8c-de50-4fad-a148-fea153ad382b", "email": "alpogos@gmail.com", "email_verified": false, "phone_verified": false}', 'email', '2025-06-05 01:27:54.006607+00', '2025-06-05 01:27:54.006627+00', '2025-06-05 01:27:54.006627+00', 'c407a191-7980-434b-8af6-4ac94030b21e');    

-- root thread
insert into public.threads
  (id, user_id, parent_id, title)
values
  ('5ef4a8d8-ba9a-4119-8dab-887d90e90f61','1ba96f8c-de50-4fad-a148-fea153ad382b', null, 'Learning the Solar System'),

  -- sub-threads
  ('6dbe2535-fce3-4755-b6fa-101c29a5d563','1ba96f8c-de50-4fad-a148-fea153ad382b','5ef4a8d8-ba9a-4119-8dab-887d90e90f61',null),
  ('25db97f0-c22c-4a61-b73c-a6135d977e1c','1ba96f8c-de50-4fad-a148-fea153ad382b','5ef4a8d8-ba9a-4119-8dab-887d90e90f61', null),

  -- sub-sub-threads
  ('7f3e489b-2be6-4b71-b3bd-6c187dbe4c66', '1ba96f8c-de50-4fad-a148-fea153ad382b', '6dbe2535-fce3-4755-b6fa-101c29a5d563', null);


insert into public.messages
  (id, thread_id, sender, content, created_at)
values
  -- root messages
  ('3ebf0db3-e8dd-4f2d-9357-88e1be7091b9','5ef4a8d8-ba9a-4119-8dab-887d90e90f61','user','Tell me about the solar system and its planets.','2025-06-04 10:00:05'),
  ('75a78a08-779a-4644-94f6-9a8591ca4f43','5ef4a8d8-ba9a-4119-8dab-887d90e90f61','assistant','Sure! Our solar system includes Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Theres also dwarf planet, Pluto which is no longer considered a planet.','2025-06-04 10:00:10'),

  -- sub-threads messages
  ('be5df0e9-5e0b-42b0-aa9a-9fd7b5f9fe5c','6dbe2535-fce3-4755-b6fa-101c29a5d563','user','more details about mars please','2025-06-04 10:04:05'),
  ('ad06295f-fb0c-428c-abf6-16e54bd6d87d','6dbe2535-fce3-4755-b6fa-101c29a5d563','assistant','Mars is a cold, desert-like, rocky planet, the fourth from the Sun. Known as the "Red Planet" due to its reddish appearance caused by iron oxide on its surface. Mars has a very thin atmosphere, primarily carbon dioxide, and features like polar ice caps, volcanoes, canyons, and weather patterns.','2025-06-04 10:05:05'),
  ('82426e83-4ca3-49c7-b00e-2a8639a07f1d','25db97f0-c22c-4a61-b73c-a6135d977e1c','user','tell me about pluto in more details','2025-06-04 10:04:12'),
  ('118b6665-68d7-4752-95eb-638cb2e00817','25db97f0-c22c-4a61-b73c-a6135d977e1c','assistant','Pluto is a dwarf planet, the most famous and largest of its kind, located in the Kuiper Belt, a region of the solar system beyond Neptune. It was once considered the ninth planet, but it was reclassified as a dwarf planet in 2006.','2025-06-04 10:05:12'),

  -- sub-sub-threads messages
  ('7f3e489b-2be6-4b71-b3bd-6c187dbe4c66', '7f3e489b-2be6-4b71-b3bd-6c187dbe4c66', 'user', 'whats iron oxide?', '2025-06-04 11:05:05'),
  ('574e9231-bf04-429c-ba19-9042e110f78e', '7f3e489b-2be6-4b71-b3bd-6c187dbe4c66', 'assistant', 'Iron oxide is a compound formed by the chemical combination of iron and oxygen. Its a naturally occurring mineral and a common ingredient in various materials. Iron oxide exists in different forms, the most well-known being rust, which is a type of ferric oxide (Fe₂O₃). Other forms include ferrous oxide (FeO) and magnetite (Fe₃O₄). ', '2025-06-04 11:25:05');


insert into public.anchors
  (id, message_id, thread_id, start_index, end_index)
values
  ('fed27dd1-7849-4d10-bef2-dec6377c8735','75a78a08-779a-4644-94f6-9a8591ca4f43','6dbe2535-fce3-4755-b6fa-101c29a5d563',55,59),
  ('57555ef7-2292-4634-8fd2-14c72548acb1','75a78a08-779a-4644-94f6-9a8591ca4f43','25db97f0-c22c-4a61-b73c-a6135d977e1c',125,130),
  ('19740840-3364-4d9a-aa3f-fb18192c14af','ad06295f-fb0c-428c-abf6-16e54bd6d87d','7f3e489b-2be6-4b71-b3bd-6c187dbe4c66',134,145);


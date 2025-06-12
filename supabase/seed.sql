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

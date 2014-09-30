OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, '1501655433409890', 'f34cee1d2c9fc00a53504bd5555eb9d0'
end

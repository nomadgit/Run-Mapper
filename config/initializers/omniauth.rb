OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, '1501572186751548', '6308dd90d69874bba975162865f0ee69'
end

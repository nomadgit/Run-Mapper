OmniAuth.config.logger = Rails.logger

Rails.application.config.middleware.use OmniAuth::Builder do
  provider :facebook, '1501569690085131', '6b446ba7292da92ad47d8130fe83d446'
end

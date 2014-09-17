class WelcomeController < ApplicationController
  def home
  	#for navbar tab highlight
  	@current = "home"
  end

  def about
  	#for navbar tab highlight
  	@current = "about"
  end
end

class StaticPagesController < ApplicationController
    def hello_world  
    end

    def login
    end

    def create
    end
    
    def home
        render 'activity'
    end
    
end

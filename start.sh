#!/bin/bash
yarn install # Ensure all JS dependencies are up to date
bin/webpack # Rebuild assets
rails assets:precompile # Precompile assets for production environment
rails s # Start the Rails server

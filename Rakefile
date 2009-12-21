PROJECT_VERSION="0.1.2"

task :clean do
  `rm -rf pkg`
end

task :package => :clean do
  `mkdir pkg`
  `cd docs && project-kit build src build`
  `mv docs/build pkg/docs`
  `cp -R src pkg/www`
  `cp LICENSE README pkg`
end

task :copy_assets do
  `rm -rf docs/{images,javascripts,stylesheets}`
  `cp -R src/* docs`
end
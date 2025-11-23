import os

# Define your project structure
structure = {
    "app": {
        "page.js": "",
        "gallery": {
            "page.js": "",
        },
        "projects": {
            "[id]": {
                "page.js": "",
            }
        },
        "about": {
            "page.js": "",
        },
        "contact": {
            "page.js": "",
        },
        "layout.js": "",
    },
    "components": {
        "Navigation.js": "",
        "ProjectCard.js": "",
        "Lightbox.js": "",
        "Footer.js": "",
    },
    "lib": {
        "supabase.js": "",
    },
    "public": {},
}

def create_structure(base_path, structure):
    """
    Recursively creates folders and files from the given structure dict.
    Skips existing files/folders to avoid overwriting.
    """
    for name, content in structure.items():
        path = os.path.join(base_path, name)
        
        # If content is a dict → it's a folder
        if isinstance(content, dict):
            if not os.path.exists(path):
                os.makedirs(path)
                print(f"📁 Created folder: {path}")
            else:
                print(f"✅ Folder exists: {path}")
            create_structure(path, content)
        
        # If content is a string → it's a file
        else:
            if not os.path.exists(path):
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"📝 Created file: {path}")
            else:
                print(f"✅ File exists: {path}")

if __name__ == "__main__":
    project_root = os.getcwd()  # or specify a custom path
    create_structure(project_root, structure)
    print("\n✨ Project structure verified and created successfully!")

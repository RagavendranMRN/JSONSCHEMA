import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'formly-app-example',
  templateUrl: './app.component.html'
})
export class AppComponent {
  form: FormGroup;
  model: any;
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];

  schema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    additionalProperties: { type: 'object' }
  };
  jsonSchema: {};
  constructor(
    private formlyJsonschema: FormlyJsonschema,
    private http: HttpClient
  ) {
    this.loadExample('jsonResponse');
  }

  loadExample(type: string) {
    this.http
      .get<any>(`assets/json-schema/${type}.json`)
      .pipe(
        tap(json => {
          json.entities.map(entity => {
            this.schema.title = entity.name;
            let fieldConfigs = [];
            entity.fields.map(field => {
              let fld = {};
              let defaultValues = {
                name: field.name,
                id: field.id,
                key: field.key,
                type: field.type,
                title: field.name,
                readOnly: field.readOnly
              };

              let tempOpt = {
                widget: {
                  type: field.type,
                  formlyConfig: {
                    type: field.type,
                    templateOptions: {
                      translation: field.translation,
                      options: field.options
                    }
                  }
                }
              };

              fld[field.name] = {
                ...defaultValues,
                ...tempOpt
              };
              fieldConfigs.push(fld);
            });
            this.schema.properties = Object.assign({}, ...fieldConfigs);
            this.jsonSchema = { schema: this.schema };
          });

          this.form = new FormGroup({});
          this.options = {};
          this.fields = [this.formlyJsonschema.toFieldConfig(this.jsonSchema)];
          this.model = {};

          console.log(this.jsonSchema);
        })
      )
      .subscribe();
  }

  // loadExample(type: string) {
  //   this.http
  //     .get<any>(`assets/json-schema/${type}.json`)
  //     .pipe(
  //       tap(({ schema, model }) => {
  //         this.form = new FormGroup({});
  //         this.options = {};
  //         this.fields = [this.formlyJsonschema.toFieldConfig(schema)];
  //         this.model = model;
  //       })
  //     )
  //     .subscribe();
  // }

  submit() {
    alert(JSON.stringify(this.model));
  }
}
